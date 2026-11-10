import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FilesService } from '../../../google-drive/services/files/files.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { updateFileSchema } from '../schemas/files.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class UpdateFileTool {
  constructor(
    private readonly googleDriveService: FilesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.UPDATE_FILE,
    description:
      'Update file metadata or text content in the authenticated user Google Drive.',
    inputSchema: updateFileSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async updateFile(input: z.infer<typeof updateFileSchema>, ctx: McpContext) {
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

    // Verify tool access before updating the file.
    await this.mcpToolAccessService.verifyToolAccess(
      userId,
      clientId,
      MCP_TOOLS.UPDATE_FILE,
    );

    // Apply the requested metadata and/or content changes.
    const file = await this.googleDriveService.updateFile(userId, input);

    return {
      status: 'ok',
      file,
    };
  }
}
