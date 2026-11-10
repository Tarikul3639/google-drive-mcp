import { Controller, Get } from '@nestjs/common';

import { ConfigService } from '../../../config/config.service.js';

import type {
  OAuthAuthorizationServerMetadata,
  OpenIdConfiguration,
} from './interfaces/oauth-metadata.interface.js';

@Controller()
export class OAuthMetadataController {
  constructor(private readonly configService: ConfigService) {}

  @Get([
    '.well-known/oauth-authorization-server',
    '.well-known/oauth-authorization-server/api/mcp/oauth',
    'mcp/oauth/.well-known/oauth-authorization-server',
  ])
  getAuthorizationServerMetadata(): OAuthAuthorizationServerMetadata {
    const issuer = this.configService.mcpAuthorizationServer;
    const oauthBaseUrl = issuer;

    return {
      issuer,
      authorization_endpoint: `${oauthBaseUrl}/authorize`,
      token_endpoint: `${oauthBaseUrl}/token`,
      registration_endpoint: `${oauthBaseUrl}/register`,

      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['none'],
      code_challenge_methods_supported: ['S256'],
    };
  }

  @Get([
    '.well-known/openid-configuration',
    '.well-known/openid-configuration/api/mcp/oauth',
    'mcp/oauth/.well-known/openid-configuration',
  ])
  getOpenIdConfiguration(): OpenIdConfiguration {
    const issuer = this.configService.mcpAuthorizationServer;
    const oauthBaseUrl = issuer;

    return {
      issuer,
      authorization_endpoint: `${oauthBaseUrl}/authorize`,
      token_endpoint: `${oauthBaseUrl}/token`,
      registration_endpoint: `${oauthBaseUrl}/register`,

      response_types_supported: ['code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      token_endpoint_auth_methods_supported: ['none'],
      code_challenge_methods_supported: ['S256'],
    };
  }
}
