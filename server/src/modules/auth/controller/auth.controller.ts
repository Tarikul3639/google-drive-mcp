import {
    Controller,
    Get,
    Post,
    UseGuards,
    Req,
    Res,
    HttpCode,
    HttpStatus,
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
import { CurrentUser } from '../decorators/current-user.decorator.js';

import type { UserResponseDto } from '../../users/dto/user-response.dto.js';

import { LoginService } from '../services/login.service.js';
import { LogoutService } from '../services/logout.service.js';
import { RefreshService } from '../services/refresh.service.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginService: LoginService,
        private readonly logoutService: LogoutService,
        private readonly refreshService: RefreshService,
        private readonly configService: ConfigService,
    ) { }

    private get cookieOptions() {
        return {
            httpOnly: true,
            secure: this.configService.isProduction,
            sameSite: 'lax' as const,
            path: '/',
        };
    }

    /**
     * Get authenticated user.
     */
    @Get('me')
    @UseGuards(AccessTokenGuard)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Get authenticated user' })
    getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
        return user;
    }

    /**
     * Refresh access and refresh tokens.
     */
    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Refresh authentication tokens' })
    async refresh(
        @Req() request: Request,
        // NOTE: Passthrough means, that NestJS will not automatically send the response, allowing us to set cookies manually
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ message: string }> {
        const tokens = await this.refreshService.refresh(
            request.refreshTokenHash!,
        );

        response.cookie(
            this.configService.accessTokenCookieName,
            tokens.accessToken,
            {
                ...this.cookieOptions,
                maxAge: this.configService.jwtAccessTtlMs,
            },
        );

        response.cookie(
            this.configService.refreshTokenCookieName,
            tokens.refreshToken,
            {
                ...this.cookieOptions,
                maxAge: this.configService.refreshTokenTtlMs,
            },
        );

        return { message: 'Tokens refreshed successfully' };
    }


    /**
     * Logout authenticated user.
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
        await this.logoutService.logout(request.auth!.sid);

        response.clearCookie(
            this.configService.accessTokenCookieName,
            this.cookieOptions,
        );

        response.clearCookie(
            this.configService.refreshTokenCookieName,
            this.cookieOptions,
        );
    }
}