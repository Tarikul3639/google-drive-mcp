import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service.js';
import { MCP_TOOL_NAMES } from '../constants/mcp-tools.constant.js';

@Injectable()
export class McpToolRegistryService {
  constructor(private readonly prisma: PrismaService) {}

  // Synchronize registered MCP tools with a user's client permissions.
  async execute(userId: string, clientId: string): Promise<void> {
    // Find the user's client authorization grant.
    const clientAccess =
      await this.prisma.db.orm.public.McpClientAccess.whereUnique({
        userId,
        clientId,
      }).first();

    if (!clientAccess || clientAccess.revokedAt) {
      return;
    }

    // Fetch existing tool permissions for this authorization.
    const existingAccess = await this.prisma.db.orm.public.McpToolAccess.where({
      clientAccessId: clientAccess.id,
    }).all();

    const existingToolNames = new Set(
      existingAccess.map((access) => access.toolName),
    );

    // Identify newly registered tools that have no permission record.
    const missingTools = MCP_TOOL_NAMES.filter(
      (toolName) => !existingToolNames.has(toolName),
    );

    if (missingTools.length === 0) {
      return;
    }

    // Create permissions for newly registered tools without changing existing settings.
    await this.prisma.db.orm.public.McpToolAccess.createAll(
      missingTools.map((toolName) => ({
        clientAccessId: clientAccess.id,
        toolName,
        isEnabled: true,
      })),
    );
  }
}
