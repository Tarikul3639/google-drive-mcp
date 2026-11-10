import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FilesService } from '../../../../google-drive/services/files/files.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { moveFileSchema } from '../../schemas/files.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class MoveFileTool {
  constructor(
    private readonly googleDriveService: FilesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.MOVE_FILE,
    description:
      'Move a file to another folder in the authenticated user Google Drive.',
    inputSchema: moveFileSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async moveFile(input: z.infer<typeof moveFileSchema>, ctx: McpContext) {
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

    // Verify tool access before moving the file.
    await this.mcpToolAccessService.verifyToolAccess(
      userId,
      clientId,
      MCP_TOOLS.MOVE_FILE,
    );

    // Move the file only after authorization succeeds.
    const file = await this.googleDriveService.moveFile(
      userId,
      input.fileId,
      input.parentId,
    );

    return {
      status: 'ok',
      file,
    };
  }
}
