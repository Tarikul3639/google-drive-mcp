import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { moveFolderSchema } from '../schemas/move-folder.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class MoveFolderTool {
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.MOVE_FOLDER,
    description:
      "Move a folder to another parent folder in the authenticated user's Google Drive.",
    inputSchema: moveFolderSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async moveFolder(input: z.infer<typeof moveFolderSchema>, ctx: McpContext) {
    // Extract authenticated user and OAuth client IDs from the token.
    const userId = ctx.authInfo?.extra?.userId;
    const clientId = ctx.authInfo?.clientId;

    // Ensure the request contains valid authentication context.
    if (
      typeof userId !== 'string' ||
      !userId ||
      typeof clientId !== 'string' ||
      !clientId
    ) {
      throw new UnauthorizedException('Authentication required.');
    }

    // Verify tool access before executing the requested Drive operation.
    await this.mcpToolAccessService.verifyToolAccess(
      userId,
      clientId,
      MCP_TOOLS.MOVE_FOLDER,
    );

    const folder = await this.googleDriveService.moveFolder(
      userId,
      input.folderId,
      input.parentId,
    );

    return {
      status: 'ok',
      folder,
    };
  }
}
