import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';

import { ConfigService } from '../../../config/config.service.js';

import { SessionService } from './session.service.js';
import { UsersService } from '../../users/users.service.js';

import type { GoogleUser } from '../interfaces/google-user.interface.js';
import type { AccessTokenPayload } from '../interfaces/token-payload.interface.js';

export interface GoogleAuthLoginResult {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  async login(googleUser: GoogleUser): Promise<GoogleAuthLoginResult> {
    if (!googleUser.email) {
      throw new UnauthorizedException('Google email not found.');
    }

    const user = await this.usersService.findOrCreateGoogleUser(googleUser);

    // Generate refresh token.
    const refreshToken = randomBytes(64).toString('base64url');

    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const refreshTokenExpiresAt = new Date(
      Date.now() + this.configService.refreshTokenTtlMs,
    );

    // Create application session.
    const session = await this.sessionService.create({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
    });

    // Generate access token.
    const payload: AccessTokenPayload = {
      sub: user.id,
      sid: session.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }
}
