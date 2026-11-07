import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { McpTokenVerifier } from '@nestjs/mcp';
import type { AuthInfo } from '@modelcontextprotocol/server';

import { ConfigService } from '../../../config/config.service.js';

import type { McpAccessTokenPayload } from './interfaces/mcp-access-token-payload.interface.js';

@Injectable()
export class IdentityProviderTokenVerifier implements McpTokenVerifier {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async verifyAccessToken(token: string): Promise<AuthInfo | null> {
        try {
            const payload =
                await this.jwtService.verifyAsync<McpAccessTokenPayload>(token);

            if (!payload.sub || !payload.client_id || !payload.exp) {
                return null;
            }

            const audiences = Array.isArray(payload.aud)
                ? payload.aud
                : [payload.aud];

            if (!audiences.includes(this.configService.mcpResource)) {
                return null;
            }

            return {
                token,
                clientId: payload.client_id,
                scopes: [],
                resource: new URL(this.configService.mcpResource),
                expiresAt: payload.exp,
            };
        } catch {
            return null;
        }
    }
}
