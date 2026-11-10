import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service.js';
import { RedisService } from '../../../redis/redis.service.js';
import { RedisKeys } from '../../../redis/redis.keys.js';
import { GoogleTokenService } from './google-token.service.js';

import type { GoogleDriveAuthResult } from '../interfaces/google-drive-auth.interface.js';

// Normalize date fields because Redis JSON values and database values have different runtime types.
const mapGoogleAccount = <T extends { expiresAt: Date | string | null }>(
  account: T,
): Omit<T, 'expiresAt'> & { expiresAt: Date | null } => ({
  ...account,
  expiresAt: account.expiresAt ? new Date(account.expiresAt) : null,
});

@Injectable()
export class GoogleIntegrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly googleTokenService: GoogleTokenService,
  ) {}

  /**
   * Connects a user's Google account to the application.
   */
  async connect(userId: string, googleAccount: GoogleDriveAuthResult) {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }

    const { googleId, email, accessToken, refreshToken, expiresIn } =
      googleAccount;

    if (!googleId || !email || !accessToken) {
      throw new BadRequestException(
        'Google account information is incomplete.',
      );
    }

    const existingAccount = await this.findByUserId(userId);

    const existingGoogleAccount =
      await this.prisma.db.orm.public.GoogleAccount.whereUnique({
        googleId,
      }).first();

    if (existingGoogleAccount && existingGoogleAccount.userId !== userId) {
      throw new ConflictException(
        'This Google account is already connected to another user.',
      );
    }

    const encryptedAccessToken = this.googleTokenService.encrypt(accessToken);

    const encryptedRefreshToken = refreshToken
      ? this.googleTokenService.encrypt(refreshToken)
      : existingAccount?.googleId === googleId
        ? existingAccount.refreshToken
        : null;

    if (!encryptedRefreshToken) {
      throw new ConflictException(
        'Google refresh token is required. Please reconnect your Google account.',
      );
    }

    const expiresAt =
      typeof expiresIn === 'number' && expiresIn > 0
        ? new Date(Date.now() + expiresIn * 1000)
        : null;

    const accountData = {
      googleId,
      email,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt,
    };

    await this.redisService.del(RedisKeys.googleAccountByUserId(userId));

    if (existingAccount) {
      return await this.prisma.db.orm.public.GoogleAccount.where({
        userId,
      }).update(accountData);
    }

    return await this.prisma.db.orm.public.GoogleAccount.create({
      userId,
      ...accountData,
    });
  }

  /**
   * Finds a connected Google account by application user ID.
   */
  async findByUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }

    // 1. Check Redis cache
    const cachedAccount = await this.redisService.get(
      RedisKeys.googleAccountByUserId(userId),
    );

    if (cachedAccount) {
      // Keep the cached result consistent with the database result.
      return mapGoogleAccount(JSON.parse(cachedAccount));
    }

    // 2. Cache miss: fetch from database
    const account = await this.prisma.db.orm.public.GoogleAccount.whereUnique({
      userId,
    }).first();

    if (!account) {
      return null;
    }

    // 3. Store in Redis (5 minutes)
    await this.redisService.set(
      RedisKeys.googleAccountByUserId(userId),
      JSON.stringify(account),
      300,
    );

    return mapGoogleAccount(account);
  }

  /**
   * Updates encrypted Google OAuth tokens.
   *
   * Called when Google OAuth2 automatically refreshes tokens.
   */
  async updateTokens(
    userId: string,
    data: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date | null;
    },
  ): Promise<void> {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }

    await this.prisma.db.orm.public.GoogleAccount.where({ userId }).update(
      data,
    );
    await this.redisService.del(RedisKeys.googleAccountByUserId(userId));
  }

  /**
   * Checks whether the user has connected a Google account.
   */
  async isConnected(userId: string): Promise<boolean> {
    const account = await this.findByUserId(userId);

    return !!account;
  }

  /**
   * Disconnects the user's Google account.
   *
   * This removes the locally stored account and tokens.
   * It does not revoke the OAuth grant at Google.
   */
  async disconnect(userId: string): Promise<void> {
    const account = await this.findByUserId(userId);

    if (!account) {
      throw new NotFoundException('Google Drive account is not connected.');
    }

    const refreshToken = account.refreshToken
      ? this.googleTokenService.decrypt(account.refreshToken)
      : null;
    if (refreshToken) {
      const response = await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ token: refreshToken }),
      });

      if (!response.ok && response.status !== 400) {
        throw new BadGatewayException(
          'Google did not revoke the account access. Please try again.',
        );
      }
    }

    await this.prisma.db.orm.public.GoogleAccount.whereUnique({
      userId,
    }).delete();
    await this.redisService.del(RedisKeys.googleAccountByUserId(userId));
  }
}
