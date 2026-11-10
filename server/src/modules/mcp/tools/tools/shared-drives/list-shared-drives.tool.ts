import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { SharedDrivesService } from '../../../../google-drive/services/shared-drives/shared-drives.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { listSharedDrivesSchema } from '../../schemas/shared-drives.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class ListSharedDrivesTool {
  constructor(
    private readonly googleDriveService: SharedDrivesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.LIST_SHARED_DRIVES,
    description: 'List shared drives available to the authenticated user.',
    inputSchema: listSharedDrivesSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async listSharedDrives(
    input: z.infer<typeof listSharedDrivesSchema>,
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
      MCP_TOOLS.LIST_SHARED_DRIVES,
    );

    // Execute the authorized operation.
    const drives = await this.googleDriveService.listSharedDrives(
      userId,
      input,
    );

    return {
      status: 'ok',
      drives,
    };
  }
}
