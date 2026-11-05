import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';

import { ConfigService } from '../../../config/config.service.js';

import type {
    AccessTokenPayload,
    RefreshTokenData,
} from '../interfaces/token-payload.interface.js';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Generate JWT access token.
     */
    async generateAccessToken(
        userId: string,
        sessionId: string,
    ): Promise<string> {
        const payload: AccessTokenPayload = {
            sub: userId,
            sid: sessionId,
        };

        return this.jwtService.signAsync(payload, {
            secret: this.configService.jwtAccessSecret,
            expiresIn: this.configService.jwtAccessTtlMs / 1000, // Convert milliseconds to seconds
        });
    }

    /**
     * Verify JWT access token.
     */
    async verifyAccessToken(
        token: string,
    ): Promise<AccessTokenPayload> {
        return this.jwtService.verifyAsync<AccessTokenPayload>(token, {
            secret: this.configService.jwtAccessSecret,
        });
    }

    /**
     * Generate cryptographically secure refresh token.
     */
    generateRefreshToken(): RefreshTokenData {
        const token = randomBytes(64).toString('base64url');

        return {
            token,
            hash: this.hashRefreshToken(token),
            expiresAt: new Date(
                Date.now() + this.configService.refreshTokenTtlMs,
            ),
        };
    }

    /**
     * Hash refresh token using SHA-256.
     */
    hashRefreshToken(token: string): string {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }
}