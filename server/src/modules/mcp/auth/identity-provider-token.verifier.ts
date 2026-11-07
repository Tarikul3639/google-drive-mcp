import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { McpTokenVerifier } from '@nestjs/mcp';
import type { AuthInfo } from '@modelcontextprotocol/server';

import type { McpAccessTokenPayload } from './interfaces/mcp-access-token-payload.interface.js';

@Injectable()
export class IdentityProviderTokenVerifier implements McpTokenVerifier {
    private readonly logger = new Logger(IdentityProviderTokenVerifier.name);

    constructor(private readonly jwtService: JwtService) { }

    /**
     * Verify MCP access token and extract authentication information.
     */
    async verifyAccessToken(token: string): Promise<AuthInfo | null> {
        try {
            const payload =
                await this.jwtService.verifyAsync<McpAccessTokenPayload>(token);

            if (!payload.sub || !payload.client_id || !payload.scope) {
                return null;
            }

            return {
                token,
                clientId: payload.client_id,
                scopes: payload.scope.split(' ').filter(Boolean),
            };
        } catch {
            this.logger.debug('MCP access token verification failed.');
            return null;
        }
    }
}
