import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FilesService } from '../../../google-drive/services/files/files.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { deleteFileSchema } from '../schemas/files.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class DeleteFileTool {
  constructor(
    private readonly googleDriveService: FilesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.DELETE_FILE,
    description:
      "Permanently delete a file from the authenticated user's Google Drive.",
    inputSchema: deleteFileSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async deleteFile(input: z.infer<typeof deleteFileSchema>, ctx: McpContext) {
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
      MCP_TOOLS.DELETE_FILE,
    );

    // Execute the Drive operation only after authorization succeeds.
    await this.googleDriveService.deleteFile(userId, input.fileId);

    return {
      status: 'ok',
      deleted: true,
    };
  }
}
