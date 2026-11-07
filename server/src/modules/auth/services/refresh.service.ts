import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';

import { ConfigService } from '../../../config/config.service.js';
import { SessionService } from './session.service.js';

import type { AccessTokenPayload } from '../interfaces/token-payload.interface.js';

@Injectable()
export class RefreshService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
    ) { }

    async refresh(
        oldTokenHash: string,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        // Generate a new refresh token.
        const refreshToken = randomBytes(64).toString('base64url');

        const newTokenHash = createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        const expiresAt = new Date(
            Date.now() + this.configService.refreshTokenTtlMs,
        );

        // Atomically rotate the old refresh token.
        const session = await this.sessionService.rotateRefreshToken({
            oldTokenHash,
            newTokenHash,
            expiresAt,
        });

        if (!session) {
            throw new UnauthorizedException(
                'Invalid or expired refresh token',
            );
        }

        // Generate a new access token.
        const payload: AccessTokenPayload = {
            sub: session.userId,
            sid: session.id,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            refreshToken,
        };
    }
}