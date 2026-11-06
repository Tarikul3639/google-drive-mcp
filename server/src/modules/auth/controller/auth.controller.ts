
import {
    Controller,
    Get,
    Post,
    UseGuards,
    Req,
    Res,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
} from '@nestjs/common';

import type { Response, Request } from 'express';

import {
    ApiTags,
    ApiCookieAuth,
    ApiOperation,
} from '@nestjs/swagger';

import { ConfigService } from '../../../config/config.service.js';

import { AccessTokenGuard } from '../guards/access-token.guard.js';
import { RefreshTokenGuard } from '../guards/refresh-token.guard.js';
import { GoogleAuthGuard } from '../guards/google-auth.guard.js';

import { CurrentUser } from '../decorators/current-user.decorator.js';

import type { UserResponseDto } from '../../users/dto/user-response.dto.js';

import { LogoutService } from '../services/logout.service.js';
import { RefreshService } from '../services/refresh.service.js';
import { GoogleAuthService } from '../services/google-auth.service.js';
import { OAuthStateService } from '../services/oauth-state.service.js';

/**
 * Handles application authentication endpoints, including
 * Google OAuth login, user authentication, token refresh, and logout.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly logoutService: LogoutService,
        private readonly refreshService: RefreshService,
        private readonly googleAuthService: GoogleAuthService,
        private readonly oauthStateService: OAuthStateService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Returns the common cookie options used for authentication tokens.
     *
     * - httpOnly: Prevents JavaScript access to cookies.
     * - secure: Sends cookies over HTTPS in production.
     * - sameSite: Helps protect against cross-site request forgery.
     * - path: Makes cookies available across application routes.
     */
    private get cookieOptions() {
        return {
            httpOnly: true,
            secure: this.configService.isProduction,
            sameSite: 'lax' as const,
            path: '/',
        };
    }

    /**
     * Initiates Google OAuth 2.0 authentication.
     *
     * GoogleAuthGuard redirects the user to Google's authentication page.
     * No additional controller logic is required.
     *
     * @returns Redirects the user to Google OAuth consent screen.
     */
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Login with Google' })
    googleLogin(): void {
        // Passport handles the redirect to Google.
    }

    /**
     * Handles the callback after successful Google OAuth authentication.
     *
     * Passport validates the Google profile and attaches it to request.user.
     * GoogleAuthService finds or creates the application user,
     * creates an authentication session, and generates application tokens.
     *
     * Both access and refresh tokens are stored in HttpOnly cookies.
     *
     * @param request - Express request containing the authenticated Google user.
     * @param response - Express response used to set authentication cookies.
     * @returns A success message after authentication.
     * @throws NotFoundException If the Google user is missing from the request.
     */
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Google OAuth callback' })
    async googleCallback(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ message: string }> {
        // Extract state returned by Google.
        const state = request.query.state;

        if (typeof state !== 'string' || !state) {
            throw new UnauthorizedException('OAuth state is missing.');
        }

        // Validate and consume the state.state
        // This also prevents the same state from being reused.
        await this.oauthStateService.consume(state);

        // Get authenticated Google user.
        const googleUser = request.user;

        if (!googleUser) {
            throw new UnauthorizedException('Google user not found.');
        }

        // Generate application authentication tokens.
        const tokens = await this.googleAuthService.login(googleUser);

        // Set access token cookie.
        response.cookie(
            this.configService.accessTokenCookieName,
            tokens.accessToken,
            {
                ...this.cookieOptions,
                maxAge: this.configService.jwtAccessTtlMs,
            },
        );

        // Set refresh token cookie.
        response.cookie(
            this.configService.refreshTokenCookieName,
            tokens.refreshToken,
            {
                ...this.cookieOptions,
                maxAge: this.configService.refreshTokenTtlMs,
            },
        );

        return {
            message: 'Google authentication successful',
        };
    }
    /**
     * Returns the currently authenticated user's profile.
     *
     * AccessTokenGuard validates the access JWT before this handler executes.
     *
     * @param user - Authenticated user provided by CurrentUser decorator.
     * @returns The authenticated user's public profile.
     */
    @Get('me')
    @UseGuards(AccessTokenGuard)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Get authenticated user' })
    getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
        return user;
    }

    /**
     * Rotates the current refresh token and issues a new token pair.
     *
     * RefreshTokenGuard extracts and validates the refresh token,
     * then attaches its hash to the request.
     *
     * The old refresh token becomes invalid after successful rotation.
     *
     * @param request - Express request containing the refresh token hash.
     * @param response - Express response used to update authentication cookies.
     * @returns A success message after token rotation.
     */
    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Refresh authentication tokens' })
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ message: string }> {
        const tokens = await this.refreshService.refresh(
            request.refreshTokenHash!,
        );

        // Replace the existing access token.
        response.cookie(
            this.configService.accessTokenCookieName,
            tokens.accessToken,
            {
                ...this.cookieOptions,
                maxAge: this.configService.jwtAccessTtlMs,
            },
        );

        // Replace the existing refresh token after rotation.
        response.cookie(
            this.configService.refreshTokenCookieName,
            tokens.refreshToken,
            {
                ...this.cookieOptions,
                maxAge: this.configService.refreshTokenTtlMs,
            },
        );

        return {
            message: 'Tokens refreshed successfully',
        };
    }

    /**
     * Logs out the currently authenticated user.
     *
     * AccessTokenGuard validates the access JWT.
     * LogoutService revokes the associated authentication session.
     * Both authentication cookies are cleared from the browser.
     *
     * @param request - Express request containing the authenticated session.
     * @param response - Express response used to clear authentication cookies.
     */
    @Post('logout')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Logout authenticated user' })
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        // Revoke the current authentication session.
        await this.logoutService.logout(request.auth!.sid);

        // Remove the access token cookie.
        response.clearCookie(
            this.configService.accessTokenCookieName,
            this.cookieOptions,
        );

        // Remove the refresh token cookie.
        response.clearCookie(
            this.configService.refreshTokenCookieName,
            this.cookieOptions,
        );
    }
}
