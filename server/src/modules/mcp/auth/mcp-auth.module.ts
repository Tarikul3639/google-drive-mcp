import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../../auth/auth.module.js';
import { UsersModule } from '../../users/users.module.js';
import { ConfigService } from '../../../config/config.service.js';

import { IdentityProviderTokenVerifier } from './identity-provider-token.verifier.js';
import { OAuthMetadataController } from './oauth-metadata.controller.js';
import { OAuthController } from './oauth.controller.js';
import { McpGoogleStrategy } from './strategies/mcp-google.strategy.js';

import { OAuthClientService } from './services/oauth-client.service.js';
import { OAuthAuthorizationService } from './services/oauth-authorization.service.js';
import { OAuthCodeService } from './services/oauth-code.service.js';
import { ToolsModule } from '../tools/tools.module.js';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ToolsModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.jwtAccessSecret,
                signOptions: {
                    expiresIn: configService.jwtAccessTtlMs / 1000,
                    audience: configService.mcpResource,
                },
                verifyOptions: {
                    audience: configService.mcpResource,
                },
            }),
        }),
    ],
    controllers: [OAuthMetadataController, OAuthController],
    providers: [
        IdentityProviderTokenVerifier,
        McpGoogleStrategy,
        OAuthClientService,
        OAuthAuthorizationService,
        OAuthCodeService,
    ],
    exports: [IdentityProviderTokenVerifier],
})
export class McpAuthModule { }
