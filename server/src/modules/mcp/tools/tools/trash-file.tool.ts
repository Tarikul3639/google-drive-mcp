import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { trashFileSchema } from '../schemas/trash-file.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class TrashFileTool {
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.TRASH_FILE,
    description: 'Move a file to the Google Drive trash.',
    inputSchema: trashFileSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async trashFile(input: z.infer<typeof trashFileSchema>, ctx: McpContext) {
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
      MCP_TOOLS.TRASH_FILE,
    );

    // Execute the Drive operation only after authorization succeeds.
    const result = await this.googleDriveService.trashFile(
      userId,
      input.fileId,
    );

    return {
      status: 'ok',
      file: result,
    };
  }
}
