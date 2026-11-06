import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TokenService } from './token.service.js';
import { SessionService } from './session.service.js';
import { UsersService } from '../../users/users.service.js';

import type { GoogleUser } from '../interfaces/google-user.interface.js';

@Injectable()
export class GoogleAuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly sessionService: SessionService,
    ) {}

    async login(googleUser: GoogleUser) {
        if (!googleUser.email) {
            throw new UnauthorizedException('Google email not found.');
        }

        // Find existing user or create a new user.
        const user = await this.usersService.findOrCreateGoogleUser(googleUser);

        // Generate application refresh token.
        const refreshTokenData = this.tokenService.generateRefreshToken();

        // Create application session.
        const session = await this.sessionService.create({
            userId: user.id,
            tokenHash: refreshTokenData.hash,
            expiresAt: refreshTokenData.expiresAt,
        });

        // Generate application access token.
        const accessToken = await this.tokenService.generateAccessToken(
            user.id,
            session.id,
        );

        return {
            accessToken,
            refreshToken: refreshTokenData.token,
        };
    }
}