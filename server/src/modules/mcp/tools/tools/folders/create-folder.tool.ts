import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FoldersService } from '../../../../google-drive/services/folders/folders.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { createFolderSchema } from '../../schemas/folders.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class CreateFolderTool {
  constructor(
    private readonly googleDriveService: FoldersService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.CREATE_FOLDER,
    description: "Create a folder in the authenticated user's Google Drive.",
    inputSchema: createFolderSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async createFolder(
    input: z.infer<typeof createFolderSchema>,
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
      MCP_TOOLS.CREATE_FOLDER,
    );

    // Execute the Drive operation only after authorization succeeds.
    const result = await this.googleDriveService.createFolder(userId, input);

    return {
      status: 'ok',
      folder: result,
    };
  }
}
