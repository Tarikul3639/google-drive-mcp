import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service.js';
import { RedisService } from '../../../../redis/redis.service.js';
import { RedisKeys } from '../../../../redis/redis.keys.js';
import { MCP_TOOL_NAMES } from '../constants/mcp-tools.constant.js';
import type { McpToolName } from '../constants/mcp-tools.constant.js';

// Cache permissions for 30 seconds.
const ACCESS_CACHE_TTL = 30;

@Injectable()
export class McpToolAccessService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService,
    ) { }

    // Verify whether a user can access a specific MCP tool.
    async verifyToolAccess(
        userId: string,
        clientId: string,
        toolName: McpToolName,
    ): Promise<void> {
        // Ensure the user has an active authorization grant.
        const clientAccessId = await this.getClientAccessId(userId, clientId);

        // Check whether the requested tool is enabled.
        const isEnabled = await this.isToolEnabled(
            userId,
            clientId,
            clientAccessId,
            toolName,
        );

        if (!isEnabled) {
            throw new ForbiddenException(`Access to tool "${toolName}" is disabled.`);
        }
    }

    // Check whether the user has an active grant, using the shared Redis cache.
    async hasActiveClientAccess(userId: string, clientId: string): Promise<boolean> {
        try {
            await this.getClientAccessId(userId, clientId);
            return true;
        } catch (error) {
            if (error instanceof ForbiddenException) return false;
            throw error;
        }
    }

    // Return the permissions currently assigned to a user's MCP client.
    async listToolAccess(userId: string, clientId: string) {
        const clientAccess =
            await this.prisma.db.orm.public.McpClientAccess.whereUnique({
                userId,
                clientId,
            }).first();

        if (!clientAccess || clientAccess.revokedAt) {
            throw new NotFoundException('MCP client access was not found.');
        }

        const existing = await this.prisma.db.orm.public.McpToolAccess.where({
            clientAccessId: clientAccess.id,
        }).all();
        const byName = new Map(existing.map((item) => [item.toolName, item]));

        return MCP_TOOL_NAMES.map((toolName) => ({
            toolName,
            isEnabled: byName.get(toolName)?.isEnabled ?? true,
        }));
    }

    // Enable or block one tool for the authenticated user's client.
    async setToolAccess(
        userId: string,
        clientId: string,
        toolName: McpToolName,
        isEnabled: boolean,
    ): Promise<void> {
        const clientAccess =
            await this.prisma.db.orm.public.McpClientAccess.whereUnique({
                userId,
                clientId,
            }).first();

        if (!clientAccess || clientAccess.revokedAt) {
            throw new NotFoundException('MCP client access was not found.');
        }

        const existing = await this.prisma.db.orm.public.McpToolAccess.where({
            clientAccessId: clientAccess.id,
            toolName,
        }).first();

        if (existing) {
            await this.prisma.db.orm.public.McpToolAccess.where({
                id: existing.id,
            }).update({ isEnabled });
        } else {
            await this.prisma.db.orm.public.McpToolAccess.create({
                clientAccessId: clientAccess.id,
                toolName,
                isEnabled,
            });
        }

        await this.invalidateToolAccess(userId, clientId, toolName);
    }

    // Get the user's client authorization ID from Redis or database.
    private async getClientAccessId(
        userId: string,
        clientId: string,
    ): Promise<string> {
        const key = RedisKeys.mcpClientAccess(userId, clientId);
        const cached = await this.redisService.get(key);

        // Return cached authorization or reject revoked access.
        if (cached !== null) {
            if (cached === '0') {
                throw new ForbiddenException('MCP client access revoked.');
            }
            return cached;
        }

        // Fetch authorization when the Redis cache misses.
        const access = await this.prisma.db.orm.public.McpClientAccess.whereUnique({
            userId,
            clientId,
        }).first();

        if (!access || access.revokedAt) {
            // Cache denied access to avoid repeated database queries.
            await this.redisService.set(key, '0', ACCESS_CACHE_TTL);
            throw new ForbiddenException('MCP client access revoked.');
        }

        // Cache the authorization ID for subsequent requests.
        await this.redisService.set(key, access.id, ACCESS_CACHE_TTL);
        return access.id;
    }

    // Check whether a specific tool is enabled for this client authorization.
    private async isToolEnabled(
        userId: string,
        clientId: string,
        clientAccessId: string,
        toolName: McpToolName,
    ): Promise<boolean> {
        const key = RedisKeys.mcpToolAccess(userId, clientId, toolName);
        const cached = await this.redisService.get(key);

        // Use the cached permission when available.
        if (cached !== null) {
            return cached === '1';
        }

        // Fetch tool permission when the Redis cache misses.
        const access = await this.prisma.db.orm.public.McpToolAccess.where({
            clientAccessId,
            toolName,
        }).first();

        // Missing permission records fail closed until the registry refreshes them.
        const isEnabled = Boolean(access?.isEnabled);

        // Cache the permission result.
        await this.redisService.set(key, isEnabled ? '1' : '0', ACCESS_CACHE_TTL);
        return isEnabled;
    }

    // Invalidate cached client authorization after grant or revoke changes.
    async invalidateClientAccess(
        userId: string,
        clientId: string,
    ): Promise<void> {
        await this.redisService.del(RedisKeys.mcpClientAccess(userId, clientId));
    }

    // Invalidate cached tool permission after block or unblock changes.
    async invalidateToolAccess(
        userId: string,
        clientId: string,
        toolName: McpToolName,
    ): Promise<void> {
        await this.redisService.del(
            RedisKeys.mcpToolAccess(userId, clientId, toolName),
        );
    }
}