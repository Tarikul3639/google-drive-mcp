import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service.js';

import type { McpTokenVerifier } from '@nestjs/mcp';
import type { AuthInfo } from '@modelcontextprotocol/server';
import { toMcpScopes } from '../../../common/constants/mcp-scopes.js';

import type { McpAccessTokenPayload } from './interfaces/mcp-access-token-payload.interface.js';

@Injectable()
export class IdentityProviderTokenVerifier implements McpTokenVerifier {
    private readonly logger = new Logger(IdentityProviderTokenVerifier.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

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

            const grant = await this.prisma.db.orm.public.McpClientAccess
                .where({ userId: payload.sub, clientId: payload.client_id })
                .first();

            if (grant?.revokedAt) return null;

            const legacyToken = grant
                ? null
                : await this.prisma.db.orm.public.McpRefreshToken
                    .where({
                        userId: payload.sub,
                        clientId: payload.client_id,
                        revokedAt: null,
                    })
                    .first();
            if (!grant && !legacyToken) return null;

            const tokenScopes = payload.scope.split(' ').filter(Boolean);
            const tokenMcpScopes = toMcpScopes(payload.scope);
            const grantedScopes = new Set(grant?.scopes ?? legacyToken?.scope ?? []);
            if (tokenMcpScopes.some((scope) => !grantedScopes.has(scope))) {
                return null;
            }

            return {
                token,
                clientId: payload.client_id,
                scopes: tokenScopes,
            };
        } catch {
            this.logger.debug('MCP access token verification failed.');
            return null;
        }
    }
}
