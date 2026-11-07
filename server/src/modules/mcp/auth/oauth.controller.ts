import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    HttpCode,
    HttpStatus,
    UseGuards,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { OAuthClientService } from './services/oauth-client.service.js';
import { OAuthAuthorizationService } from './services/oauth-authorization.service.js';
import { OAuthCodeService } from './services/oauth-code.service.js';

import { RegisterClientDto } from './dto/register-client.dto.js';
import { TokenRequestDto } from './dto/token-request.dto.js';
import { McpGoogleAuthGuard } from './guards/mcp-google-auth.guard.js';

@Controller('mcp/oauth')
export class OAuthController {
    constructor(
        private readonly oauthClientService: OAuthClientService,
        private readonly oauthAuthorizationService: OAuthAuthorizationService,
        private readonly oauthCodeService: OAuthCodeService,
    ) { }

    /**
     * Registers a new OAuth client using Dynamic Client Registration.
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    registerClient(@Body() body: RegisterClientDto) {
        return this.oauthClientService.register(body);
    }

    /**
     * Validates the authorization request and redirects the user
     * to the Google authentication flow.
     */
    @Get('authorize')
    async authorize(
        @Query() query: Record<string, string>,
        @Res() response: Response,
    ): Promise<void> {
        const googleAuthUrl =
            await this.oauthAuthorizationService.createAuthorizationUrl(query);

        response.redirect(googleAuthUrl);
    }

    /**
     * Handles Google's OAuth callback after successful authentication.
     * Validates the authenticated user and OAuth state, then redirects
     * the user back to the registered MCP client's redirect URI.
     */
    @Get('google/callback')
    @UseGuards(McpGoogleAuthGuard)
    async googleCallback(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const googleUser = request.user;
        const state = request.query.state;

        if (!googleUser) {
            throw new UnauthorizedException('Google user not found.');
        }

        if (typeof state !== 'string' || !state) {
            throw new UnauthorizedException('OAuth state is missing.');
        }

        const result = await this.oauthAuthorizationService.completeAuthorization(
            googleUser,
            state,
        );

        response.redirect(result.redirectUrl);
    }

    /**
     * Exchanges an authorization code for access and refresh tokens,
     * or exchanges a refresh token for a new token pair.
     */
    @Post('token')
    @HttpCode(HttpStatus.OK)
    async token(@Body() body: TokenRequestDto) {
        switch (body.grant_type) {
            case 'authorization_code':
                return this.oauthCodeService.exchangeAuthorizationCode(body);

            case 'refresh_token':
                return this.oauthCodeService.refreshAccessToken(body);

            default:
                throw new BadRequestException('Unsupported grant type.');
        }
    }
}
