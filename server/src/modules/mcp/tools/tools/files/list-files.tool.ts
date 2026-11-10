import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { FilesService } from '../../../../google-drive/services/files/files.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { listFilesSchema } from '../../schemas/files.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class ListFilesTool {
  constructor(
    private readonly googleDriveService: FilesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.LIST_FILES,
    description: 'List files from authenticated user Google Drive.',
    inputSchema: listFilesSchema,
    annotations: {
      readOnlyHint: true,
    },
  })
  async listFiles(input: z.infer<typeof listFilesSchema>, ctx: McpContext) {
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
      MCP_TOOLS.LIST_FILES,
    );

    // Fetch files only after authorization succeeds.
    const result = await this.googleDriveService.listFiles(
      userId,
      input.pageToken,
    );

    return {
      status: 'ok',
      files: result.files,
      nextPageToken: result.nextPageToken,
    };
  }
}
