
import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from './token.service.js';
import { SessionService } from './session.service.js';

@Injectable()
export class RefreshService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly sessionService: SessionService,
    ) {}

    async refresh(
        oldTokenHash: string,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        // Generate a new refresh token
        const refreshTokenData =
            this.tokenService.generateRefreshToken();

        // Atomically rotate the old refresh token
        const session = await this.sessionService.rotateRefreshToken({
            oldTokenHash,
            newTokenHash: refreshTokenData.hash,
            expiresAt: refreshTokenData.expiresAt,
        });

        if (!session) {
            throw new UnauthorizedException(
                'Invalid or expired refresh token',
            );
        }

        // Generate a new access token
        const accessToken =
            await this.tokenService.generateAccessToken(
                session.userId,
                session.id,
            );

        return {
            accessToken,
            refreshToken: refreshTokenData.token,
        };
    }
}
