import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FoldersService } from '../../../../google-drive/services/folders/folders.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { trashFolderSchema } from '../../schemas/folders.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class TrashFolderTool {
  constructor(
    private readonly googleDriveService: FoldersService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.TRASH_FOLDER,
    description:
      "Move a folder to the authenticated user's Google Drive trash.",
    inputSchema: trashFolderSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async trashFolder(input: z.infer<typeof trashFolderSchema>, ctx: McpContext) {
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
      MCP_TOOLS.TRASH_FOLDER,
    );

    const folder = await this.googleDriveService.trashFolder(
      userId,
      input.folderId,
    );

    return {
      status: 'ok',
      folder,
    };
  }
}
