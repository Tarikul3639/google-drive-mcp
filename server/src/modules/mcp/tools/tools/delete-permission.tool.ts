import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { deletePermissionSchema } from '../schemas/delete-permission.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class DeletePermissionTool {
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.DELETE_PERMISSION,
    description: 'Delete a permission from a Google Drive file or folder.',
    inputSchema: deletePermissionSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async deletePermission(
    input: z.infer<typeof deletePermissionSchema>,
    ctx: McpContext,
  ) {
    // Extract authenticated user and OAuth client IDs from the token.
    const userId = ctx.authInfo?.extra?.userId;
    const clientId = ctx.authInfo?.clientId;

    // Reject requests without a valid authentication context.
    if (
      typeof userId !== 'string' ||
      !userId ||
      typeof clientId !== 'string' ||
      !clientId
    ) {
      throw new UnauthorizedException('Authentication required.');
    }

    // Verify access to this specific MCP tool before calling Google Drive.
    await this.mcpToolAccessService.verifyToolAccess(
      userId,
      clientId,
      MCP_TOOLS.DELETE_PERMISSION,
    );

    // Execute the authorized permission operation.
    const result = await this.googleDriveService.deletePermission(
      userId,
      input,
    );

    return {
      status: 'ok',
      result,
    };
  }
}
