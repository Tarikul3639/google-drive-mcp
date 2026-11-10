import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FilesService } from '../../../google-drive/services/files/files.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { getFileSchema } from '../schemas/files.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class GetFileTool {
  constructor(
    private readonly googleDriveService: FilesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.GET_FILE,
    description:
      'Get details of a specific file from authenticated user Google Drive.',
    inputSchema: getFileSchema,
    annotations: {
      readOnlyHint: true,
    },
  })
  async getFile(input: z.infer<typeof getFileSchema>, ctx: McpContext) {
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

    // Verify that the user can access this client and the requested tool.
    await this.mcpToolAccessService.verifyToolAccess(
      userId,
      clientId,
      MCP_TOOLS.GET_FILE,
    );

    // Fetch file details only after authorization succeeds.
    const file = await this.googleDriveService.getFile(userId, input.fileId);

    return {
      status: 'ok',
      file,
    };
  }
}
