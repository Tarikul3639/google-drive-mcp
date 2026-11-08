import {
    Body,
    Controller,
    Get,
    Delete,
    Patch,
    Post,
    Query,
    Param,
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
import { UpdateMcpToolAccessDto } from './dto/update-mcp-tool-access.dto.js';

import { McpGoogleAuthGuard } from './guards/mcp-google-auth.guard.js';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { UserResponseDto } from '../../users/dto/user-response.dto.js';
import type { AuthorizationRequest } from './interfaces/authorization-request.interface.js';
import { MCP_TOOL_NAMES } from '../tools/constants/mcp-tools.constant.js';

/**
 * Exposes OAuth endpoints for MCP client registration, authorization,
 * token exchange, and per-client tool access management.
 */
@Controller('mcp/oauth')
export class OAuthController {
    constructor(
        private readonly oauthClientService: OAuthClientService,
        private readonly oauthAuthorizationService: OAuthAuthorizationService,
        private readonly oauthCodeService: OAuthCodeService,
    ) { }

    /**
     * Registers a new OAuth client through Dynamic Client Registration.
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    registerClient(@Body() body: RegisterClientDto) {
        return this.oauthClientService.register(body);
    }

    /**
     * Validates an incoming authorization request and redirects
     * the user to the Google authentication flow.
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
     * Handles Google's OAuth callback and redirects the authenticated
     * user to the MCP client consent page.
     */
    @Get('google/callback')
    @UseGuards(McpGoogleAuthGuard)
    async googleCallback(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const googleUser = request.user;
        const state = request.query.state;

        // Ensure Google authentication returned a user and valid OAuth state.
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
     * Returns the client and scope details needed to render the consent page.
     */
    @Get('consent')
    async getConsent(@Query('transaction') transaction: string) {
        // A consent transaction is required to identify the pending request.
        if (!transaction) {
            throw new BadRequestException('Consent transaction is required.');
        }

        return this.oauthAuthorizationService.getConsentDetails(transaction);
    }

    /**
     * Saves the user's allow/deny decision for a pending consent request.
     */
    @Post('consent')
    @HttpCode(HttpStatus.OK)
    async submitConsent(@Body() body: ConsentRequestDto) {
        return this.oauthAuthorizationService.completeConsent(body);
    }

    /**
     * Exchanges an authorization code or refresh token for OAuth tokens.
     */
    @Post('token')
    @HttpCode(HttpStatus.OK)
    async token(@Body() body: TokenRequestDto) {
        // Route each supported grant type to its corresponding token flow.
        switch (body.grant_type) {
            case 'authorization_code':
                return this.oauthCodeService.exchangeAuthorizationCode(body);

            case 'refresh_token':
                return this.oauthCodeService.refreshAccessToken(body);

            default:
                throw new BadRequestException('Unsupported grant type.');
        }
    }

    /**
     * Lists the OAuth clients currently authorized by the authenticated user.
     */
    @Get('authorized-clients')
    @UseGuards(AccessTokenGuard)
    listAuthorizedClients(@CurrentUser() user: UserResponseDto) {
        return this.oauthAuthorizationService.listAuthorizedClients(user.id);
    }

    /**
     * Returns the complete list of tool names currently supported by this server.
     */
    @Get('tools')
    @UseGuards(AccessTokenGuard)
    listAvailableTools() {
        return MCP_TOOL_NAMES.map((toolName) => ({ toolName }));
    }

    /**
     * Synchronizes the server's current tool registry for this client
     * and returns the client's tool permissions.
     */
    @Get('authorized-clients/:clientId/tools')
    @UseGuards(AccessTokenGuard)
    listClientTools(
        @CurrentUser() user: UserResponseDto,
        @Param('clientId') clientId: string,
    ) {
        return this.oauthAuthorizationService.refreshClientTools(
            user.id,
            clientId,
        );
    }

    /**
     * Refreshes a client's tool registry so newly added server tools
     * can also receive permission records.
     */
    @Post('authorized-clients/:clientId/tools/refresh')
    @UseGuards(AccessTokenGuard)
    refreshClientTools(
        @CurrentUser() user: UserResponseDto,
        @Param('clientId') clientId: string,
    ) {
        return this.oauthAuthorizationService.refreshClientTools(
            user.id,
            clientId,
        );
    }

    /**
     * Enables or disables one tool for the authenticated user's OAuth client.
     * The DTO validates the requested tool name and enabled flag.
     */
    @Patch('authorized-clients/:clientId/tools')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async updateClientTool(
        @CurrentUser() user: UserResponseDto,
        @Param('clientId') clientId: string,
        @Body() body: UpdateMcpToolAccessDto,
    ) {
        await this.oauthAuthorizationService.updateClientToolAccess(
            user.id,
            clientId,
            body.toolName,
            body.isEnabled,
        );
        return { message: 'MCP tool permission updated.' };
    }

    /**
     * Permanently deletes the authenticated user's authorization grant.
     * Related per-tool permissions are removed through the database cascade.
     */
    @Delete('authorized-clients/:clientId/access')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async deleteClientAccess(
        @CurrentUser() user: UserResponseDto,
        @Param('clientId') clientId: string,
    ) {
        await this.oauthAuthorizationService.deleteClientAccess(
            user.id,
            clientId,
        );
        return { message: 'MCP client access deleted.' };
    }

    /**
     * Revokes the authenticated user's authorization grant for an MCP client.
     */
    @Delete('authorized-clients/:clientId')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async revokeClientAccess(
        @CurrentUser() user: UserResponseDto,
        @Param('clientId') clientId: string,
    ) {
        await this.oauthAuthorizationService.revokeClientAccess(
            user.id,
            clientId,
        );
        return { message: 'MCP client access revoked.' };
    }
}
