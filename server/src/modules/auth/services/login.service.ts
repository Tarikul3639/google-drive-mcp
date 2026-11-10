import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';

import { ConfigService } from '../../../config/config.service.js';
import { SessionService } from './session.service.js';

import type { AccessTokenPayload } from '../interfaces/token-payload.interface.js';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  async login(userId: string): Promise<LoginResult> {
    // Generate refresh token.
    const refreshToken = randomBytes(64).toString('base64url');

    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const refreshTokenExpiresAt = new Date(
      Date.now() + this.configService.refreshTokenTtlMs,
    );

    // Create database session.
    const session = await this.sessionService.create({
      userId,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
    });

    // Generate access token.
    const payload: AccessTokenPayload = {
      sub: userId,
      sid: session.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
