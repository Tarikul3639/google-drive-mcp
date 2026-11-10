import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { PermissionsService } from '../../../google-drive/services/permissions/permissions.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { getPermissionSchema } from '../schemas/permissions.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class GetPermissionTool {
  constructor(
    private readonly googleDriveService: PermissionsService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.GET_PERMISSION,
    description:
      'Get a specific permission from a Google Drive file or folder.',
    inputSchema: getPermissionSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async getPermission(
    input: z.infer<typeof getPermissionSchema>,
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
      MCP_TOOLS.GET_PERMISSION,
    );

    // Execute the authorized permission operation.
    const permission = await this.googleDriveService.getPermission(
      userId,
      input,
    );

    return {
      status: 'ok',
      permission,
    };
  }
}
