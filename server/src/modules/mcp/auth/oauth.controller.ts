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
import { ConsentRequestDto } from './dto/consent-request.dto.js';

import { McpGoogleAuthGuard } from './guards/mcp-google-auth.guard.js';
import type { AuthorizationRequest } from './interfaces/authorization-request.interface.js';

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
     * Validates the authorization request and redirects
     * the user to Google authentication.
     */
    @Get('authorize')
    async authorize(
        @Query() query: AuthorizationRequest,
        @Res() response: Response,
    ): Promise<void> {
        const googleAuthUrl =
            await this.oauthAuthorizationService.createAuthorizationUrl(query);

        response.redirect(googleAuthUrl);
    }

    /**
     * Handles Google's OAuth callback.
     * Redirects the authenticated user to the consent page.
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

        const result = await this.oauthAuthorizationService.createConsentRequest(
            googleUser,
            state,
        );

        response.redirect(result.consentUrl);
    }

    /**
     * Returns the information required to display the consent page.
     */
    @Get('consent')
    async getConsent(@Query('transaction') transaction: string) {
        if (!transaction) {
            throw new BadRequestException('Consent transaction is required.');
        }

        return this.oauthAuthorizationService.getConsentDetails(transaction);
    }

    /**
     * Processes the user's consent decision.
     */
    @Post('consent')
    @HttpCode(HttpStatus.OK)
    async submitConsent(@Body() body: ConsentRequestDto) {
        return this.oauthAuthorizationService.completeConsent(body);
    }

    /**
     * Exchanges an authorization code or refresh token.
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
