import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import { PrismaService } from '../../../../prisma/prisma.service.js';
import { MCP_SCOPE_MAP, type McpScope } from '../../../../common/constants/mcp-scopes.js';

import type { RegisterClientDto } from '../dto/register-client.dto.js';
import type { OAuthClient } from '../interfaces/oauth-client.interface.js';

const DEFAULT_SCOPES: McpScope[] = [
    'DRIVE_READ',
    'DRIVE_WRITE',
];

@Injectable()
export class OAuthClientService {
    constructor(private readonly prisma: PrismaService) { }

    async register(body: RegisterClientDto): Promise<OAuthClient> {
        const grantTypes = body.grant_types ?? [
            'authorization_code',
            'refresh_token',
        ];

        const responseTypes = body.response_types ?? ['code'];
        const scopes = body.scope ?? DEFAULT_SCOPES;
        const clientId = randomBytes(24).toString('base64url');

        const client = await this.prisma.db.orm.public.McpClient.create({
            clientId,
            name: body.client_name ?? 'MCP Client',
            redirectUris: body.redirect_uris,
            scopes,
        });

        return {
            client_id: client.clientId,
            client_name: client.name,
            redirect_uris: client.redirectUris,
            grant_types: grantTypes,
            response_types: responseTypes,
            token_endpoint_auth_method:
                body.token_endpoint_auth_method ?? 'none',
            scope: client.scopes
                .map((item) => MCP_SCOPE_MAP[item])
                .join(' '),
        };
    }

    async getClient(clientId: string): Promise<OAuthClient | null> {
        const client = await this.prisma.db.orm.public.McpClient
            .whereUnique({ clientId })
            .first();

        if (!client) {
            return null;
        }

        return {
            client_id: client.clientId,
            client_name: client.name,
            redirect_uris: client.redirectUris,
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            token_endpoint_auth_method: 'none',
            scope: client.scopes
                .map((item) => MCP_SCOPE_MAP[item])
                .join(' '),
        };
    }
}
