import { Module } from '@nestjs/common';
import { McpModule as NestMcpModule } from '@nestjs/mcp';

import { ConfigService } from '../../config/config.service.js';
import { McpAuthModule } from './auth/mcp-auth.module.js';
import { IdentityProviderTokenVerifier } from './auth/identity-provider-token.verifier.js';
import { ToolsModule } from './tools/tools.module.js';

@Module({
    imports: [
        McpAuthModule,
        ToolsModule,

        NestMcpModule.forRootAsync({
            imports: [McpAuthModule],
            inject: [ConfigService, IdentityProviderTokenVerifier],

            useFactory: (
                configService: ConfigService,
                verifier: IdentityProviderTokenVerifier,
            ) => ({
                name: 'google-drive-mcp',
                version: '1.0.0',

                auth: {
                    verifier,
                    resource: configService.mcpResource,
                    authorizationServers: [
                        configService.mcpAuthorizationServer,
                    ],
                },
            }),
        }),
    ],
})
export class McpModule {}