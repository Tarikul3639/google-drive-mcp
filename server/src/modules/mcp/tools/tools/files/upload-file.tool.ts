import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FilesService } from '../../../../google-drive/services/files/files.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { uploadFileSchema } from '../../schemas/files.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class UploadFileTool {
  constructor(
    private readonly googleDriveService: FilesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.UPLOAD_FILE,
    description:
      'Upload a binary file, such as an image, to Google Drive using Base64 content. Maximum decoded file size: 10 MB.',
    inputSchema: uploadFileSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async uploadFile(input: z.infer<typeof uploadFileSchema>, ctx: McpContext) {
    const userId = ctx.authInfo?.extra?.userId;
    const clientId = ctx.authInfo?.clientId;

    if (
      typeof userId !== 'string' ||
      !userId ||
      typeof clientId !== 'string' ||
      !clientId
    ) {
      throw new UnauthorizedException('Authentication required.');
    }

    await this.mcpToolAccessService.verifyToolAccess(
      userId,
      clientId,
      MCP_TOOLS.UPLOAD_FILE,
    );

    const file = await this.googleDriveService.uploadFile(userId, input);
    return { status: 'ok', file };
  }
}
