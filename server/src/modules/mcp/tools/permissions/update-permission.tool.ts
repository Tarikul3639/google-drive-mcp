import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { PermissionsService } from '../../../google-drive/services/permissions/permissions.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { updatePermissionSchema } from '../schemas/permissions.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class UpdatePermissionTool {
  constructor(
    private readonly googleDriveService: PermissionsService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.UPDATE_PERMISSION,
    description: 'Update a permission on a Google Drive file or folder.',
    inputSchema: updatePermissionSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async updatePermission(
    input: z.infer<typeof updatePermissionSchema>,
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
      MCP_TOOLS.UPDATE_PERMISSION,
    );

    // Execute the authorized permission operation.
    const permission = await this.googleDriveService.updatePermission(
      userId,
      input,
    );

    return {
      status: 'ok',
      permission,
    };
  }
}
