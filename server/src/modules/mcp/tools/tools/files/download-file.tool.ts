import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FilesService } from '../../../../google-drive/services/files/files.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { downloadFileSchema } from '../../schemas/files.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class DownloadFileTool {
  constructor(
    private readonly googleDriveService: FilesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.DOWNLOAD_FILE,
    description:
      'Download a binary file and return its content as base64. Use export_file for Google Workspace documents.',
    inputSchema: downloadFileSchema,
    annotations: {
      readOnlyHint: true,
      openWorldHint: true,
    },
  })
  async downloadFile(
    input: z.infer<typeof downloadFileSchema>,
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
      MCP_TOOLS.DOWNLOAD_FILE,
    );

    // Execute the Drive operation only after authorization succeeds.
    const result = await this.googleDriveService.downloadFile(
      userId,
      input.fileId,
    );

    return {
      status: 'ok',
      download: result,
    };
  }
}
