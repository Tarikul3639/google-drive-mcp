import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import { PrismaService } from '../../../../prisma/prisma.service.js';
import { RedisService } from '../../../../redis/redis.service.js';
import { RedisKeys } from '../../../../redis/redis.keys.js';
import { ConfigService } from '../../../../config/config.service.js';

import type { TokenRequestDto } from '../dto/token-request.dto.js';
import type { McpAccessTokenPayload } from '../interfaces/mcp-access-token-payload.interface.js';

interface AuthorizationCodeData {
    clientId: string;
    userId: string;
    redirectUri: string;
    codeChallenge: string;
}

@Injectable()
export class OAuthCodeService {
    constructor(
        private readonly redis: RedisService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Exchange authorization code for MCP tokens.
     */
    async exchangeAuthorizationCode(body: TokenRequestDto) {
        this.validateResource(body.resource);
        const { code, client_id, redirect_uri, code_verifier } = body;

        const codeHash = this.hash(code!);

        // Atomically consume authorization code.
        const value = await this.redis.getDel(
            RedisKeys.oauthAuthorizationCode(codeHash),
        );

        if (!value) {
            throw new UnauthorizedException('Invalid or expired authorization code.');
        }

        const data = this.parseAuthorizationCode(value);

        if (data.clientId !== client_id || data.redirectUri !== redirect_uri) {
            throw new UnauthorizedException('Invalid authorization code.');
        }

        this.verifyPkce(code_verifier!, data.codeChallenge);

        await this.assertActiveGrant(data.userId, data.clientId);

        return this.issueTokens(data.userId, data.clientId);
    }

    /**
     * Exchange refresh token for new MCP tokens.
     */
    async refreshAccessToken(body: TokenRequestDto) {
        this.validateResource(body.resource);
        const { refresh_token, client_id } = body;

        const tokenHash = this.hash(refresh_token!);

        const existingToken =
            await this.prisma.db.orm.public.McpRefreshToken.whereUnique({
                tokenHash,
            }).first();

        if (
            !existingToken ||
            existingToken.clientId !== client_id ||
            existingToken.revokedAt ||
            existingToken.expiresAt.getTime() <= Date.now()
        ) {
            throw new UnauthorizedException('Invalid or expired refresh token.');
        }

        await this.assertActiveGrant(existingToken.userId, existingToken.clientId);

        const newRefreshToken = randomBytes(64).toString('base64url');

        const newRefreshTokenHash = this.hash(newRefreshToken);

        const newRefreshTokenExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

        const accessToken = await this.jwtService.signAsync<McpAccessTokenPayload>({
            sub: existingToken.userId,
            client_id: existingToken.clientId,
        }, { audience: this.configService.mcpResource });

        // Revoke old refresh token.
        await this.prisma.db.orm.public.McpRefreshToken.where({
            id: existingToken.id,
        }).update({
            revokedAt: new Date(),
        });

        // Store new refresh token hash.
        await this.prisma.db.orm.public.McpRefreshToken.create({
            tokenHash: newRefreshTokenHash,
            clientId: existingToken.clientId,
            userId: existingToken.userId,
            expiresAt: newRefreshTokenExpiresAt,
        });

        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
            token_type: 'Bearer',
            expires_in: 900,
        };
    }

    private validateResource(resource?: string): void {
        if (resource && resource !== this.configService.mcpResource) {
            throw new BadRequestException('Unsupported OAuth resource.');
        }
    }

    /**
     * Issue MCP access and refresh tokens.
     */
    private async issueTokens(userId: string, clientId: string) {
        const refreshToken = randomBytes(64).toString('base64url');

        const refreshTokenHash = this.hash(refreshToken);

        const refreshTokenExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

        const accessToken = await this.jwtService.signAsync<McpAccessTokenPayload>({
            sub: userId,
            client_id: clientId,
        }, { audience: this.configService.mcpResource });

        await this.prisma.db.orm.public.McpRefreshToken.create({
            tokenHash: refreshTokenHash,
            clientId,
            userId,
            expiresAt: refreshTokenExpiresAt,
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'Bearer',
            expires_in: 900,
        };
    }

    private async assertActiveGrant(
        userId: string,
        clientId: string,
    ): Promise<void> {
        const grant = await this.prisma.db.orm.public.McpClientAccess
            .where({ userId, clientId })
            .first();

        if (!grant || grant.revokedAt) {
            throw new UnauthorizedException('MCP client access was revoked.');
        }
    }

    /**
     * Parse authorization code data.
     */
    private parseAuthorizationCode(value: string): AuthorizationCodeData {
        let data: unknown;

        try {
            data = JSON.parse(value);
        } catch {
            throw new UnauthorizedException('Invalid authorization code data.');
        }

        if (
            typeof data !== 'object' ||
            data === null ||
            !('clientId' in data) ||
            !('userId' in data) ||
            !('redirectUri' in data) ||
            !('codeChallenge' in data)
        ) {
            throw new UnauthorizedException('Invalid authorization code data.');
        }

        const result = data as AuthorizationCodeData;

        if (
            typeof result.clientId !== 'string' ||
            typeof result.userId !== 'string' ||
            typeof result.redirectUri !== 'string' ||
            typeof result.codeChallenge !== 'string'
        ) {
            throw new UnauthorizedException('Invalid authorization code data.');
        }

        return result;
    }

    /**
     * Verify PKCE S256 challenge.
     */
    private verifyPkce(verifier: string, expectedChallenge: string): void {
        if (!/^[A-Za-z0-9_-]{43}$/.test(expectedChallenge)) {
            throw new UnauthorizedException('Invalid code challenge.');
        }

        const calculatedChallenge = createHash('sha256')
            .update(verifier)
            .digest('base64url');

        const expected = Buffer.from(expectedChallenge);
        const actual = Buffer.from(calculatedChallenge);

        if (
            expected.length !== actual.length ||
            !timingSafeEqual(expected, actual)
        ) {
            throw new UnauthorizedException('PKCE verification failed.');
        }
    }

    /**
     * SHA-256 hash.
     */
    private hash(value: string): string {
        return createHash('sha256').update(value).digest('hex');
    }
}
