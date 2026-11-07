
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service.js';

import type {
    OAuthAuthorizationServerMetadata,
    OpenIdConfiguration,
} from './interfaces/oauth-metadata.interface.js';

@Controller('.well-known')
export class OAuthMetadataController {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    @Get('oauth-authorization-server')
    getAuthorizationServerMetadata(): OAuthAuthorizationServerMetadata {
        const issuer = this.configService.mcpAuthorizationServer;
        const oauthBaseUrl = `${issuer}/api/mcp/oauth`;

        return {
            issuer,
            authorization_endpoint: `${oauthBaseUrl}/authorize`,
            token_endpoint: `${oauthBaseUrl}/token`,
            registration_endpoint: `${oauthBaseUrl}/register`,

            response_types_supported: ['code'],
            grant_types_supported: [
                'authorization_code',
                'refresh_token',
            ],
            token_endpoint_auth_methods_supported: ['none'],
            code_challenge_methods_supported: ['S256'],
            scopes_supported: ['drive:read', 'drive:write'],
        };
    }

    @Get('openid-configuration')
    getOpenIdConfiguration(): OpenIdConfiguration {
        const issuer = this.configService.mcpAuthorizationServer;
        const oauthBaseUrl = `${issuer}/api/mcp/oauth`;

        return {
            issuer,
            authorization_endpoint: `${oauthBaseUrl}/authorize`,
            token_endpoint: `${oauthBaseUrl}/token`,
            registration_endpoint: `${oauthBaseUrl}/register`,

            response_types_supported: ['code'],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS256'],
            scopes_supported: [
                'openid',
                'drive:read',
                'drive:write',
            ],
            token_endpoint_auth_methods_supported: ['none'],
            code_challenge_methods_supported: ['S256'],
        };
    }
}
