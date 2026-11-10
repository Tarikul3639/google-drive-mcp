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

import type { Request, Response } from 'express';

import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

import { ConfigService } from '../../../config/config.service.js';

import { GoogleAuthGuard } from '../guards/google-auth.guard.js';
import { AccessTokenGuard } from '../guards/access-token.guard.js';
import { RefreshTokenGuard } from '../guards/refresh-token.guard.js';

import { CurrentUser } from '../decorators/current-user.decorator.js';

import type { GoogleUser } from '../interfaces/google-user.interface.js';
import type { UserResponseDto } from '../../users/dto/user-response.dto.js';

import { LogoutService } from '../services/logout.service.js';
import { RefreshService } from '../services/refresh.service.js';
import { GoogleAuthService } from '../services/google-auth.service.js';

interface OAuthStateData {
  userId: string | null;
  redirectTo: string | null;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly logoutService: LogoutService,
    private readonly refreshService: RefreshService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Shared options for authentication cookies.
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
   * Initiates Google OAuth authentication.
   *
   * GoogleAuthGuard generates OAuth state and
   * redirects the browser to Google's authorization page.
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  googleLogin(): void {}

  /**
   * Handles Google's OAuth callback.
   *
   * Validates the Google profile, creates an application
   * session, and stores authentication tokens in cookies.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const googleUser = request.user;

    if (!googleUser) {
      throw new UnauthorizedException('Google user not found.');
    }

    const tokens = await this.googleAuthService.login(googleUser);

    // Set the access token cookie.
    response.cookie(
      this.configService.accessTokenCookieName,
      tokens.accessToken,
      {
        ...this.cookieOptions,
        maxAge: this.configService.jwtAccessTtlMs,
      },
    );

    // Set the refresh token cookie.
    response.cookie(
      this.configService.refreshTokenCookieName,
      tokens.refreshToken,
      {
        ...this.cookieOptions,
        maxAge: this.configService.refreshTokenTtlMs,
      },
    );

    // Redirect to the frontend after successful authentication.
    response.redirect(
      request.oauthStateData?.redirectTo ??
        new URL('/auth/welcome', this.configService.frontendUrl).toString(),
    );
  }

  /**
   * Returns the authenticated user's profile.
   */
  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get authenticated user' })
  getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
    return user;
  }

  /**
   * Rotates the current authentication token pair.
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
    const tokens = await this.refreshService.refresh(request.refreshTokenHash!);

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

    return {
      message: 'Tokens refreshed successfully',
    };
  }

  /**
   * Revokes the current session and clears authentication cookies.
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
