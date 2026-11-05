import { Injectable } from '@nestjs/common';

import { SessionService } from './session.service.js';
import { TokenService } from './token.service.js';

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class LoginService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly sessionService: SessionService,
    ) { }

    async login(userId: string): Promise<LoginResult> {
        // Generate refresh token
        const refreshTokenData = this.tokenService.generateRefreshToken();

        // Create database session
        const session = await this.sessionService.create({
            userId,
            tokenHash: refreshTokenData.hash,
            expiresAt: refreshTokenData.expiresAt,
        });

        // Generate access token with session ID
        const accessToken = await this.tokenService.generateAccessToken(
            userId,
            session.id,
        );

        return {
            accessToken,
            refreshToken: refreshTokenData.token,
        };
    }
}
