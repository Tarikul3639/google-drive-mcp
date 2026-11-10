import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { PermissionsService } from '../../../../google-drive/services/permissions/permissions.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { listPermissionsSchema } from '../../schemas/permissions.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class ListPermissionsTool {
  constructor(
    private readonly googleDriveService: PermissionsService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.LIST_PERMISSIONS,
    description: 'List permissions on a Google Drive file or folder.',
    inputSchema: listPermissionsSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async listPermissions(
    input: z.infer<typeof listPermissionsSchema>,
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
      MCP_TOOLS.LIST_PERMISSIONS,
    );

    // Execute the authorized permission operation.
    const permissions = await this.googleDriveService.listPermissions(
      userId,
      input,
    );

    return {
      status: 'ok',
      permissions,
    };
  }
}
