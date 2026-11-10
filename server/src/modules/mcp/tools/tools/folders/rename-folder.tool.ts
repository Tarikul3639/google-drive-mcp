import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FoldersService } from '../../../../google-drive/services/folders/folders.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { renameFolderSchema } from '../../schemas/folders.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class RenameFolderTool {
  constructor(
    private readonly googleDriveService: FoldersService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.RENAME_FOLDER,
    description: "Rename a folder in the authenticated user's Google Drive.",
    inputSchema: renameFolderSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async renameFolder(
    input: z.infer<typeof renameFolderSchema>,
    ctx: McpContext,
  ) {
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
      MCP_TOOLS.RENAME_FOLDER,
    );

    const folder = await this.googleDriveService.renameFolder(
      userId,
      input.folderId,
      input.newName,
    );

    return {
      status: 'ok',
      folder,
    };
  }
}
