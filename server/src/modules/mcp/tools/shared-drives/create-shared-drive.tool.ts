import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { SharedDrivesService } from '../../../google-drive/services/shared-drives/shared-drives.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { createSharedDriveSchema } from '../schemas/shared-drives.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class CreateSharedDriveTool {
  constructor(
    private readonly googleDriveService: SharedDrivesService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.CREATE_SHARED_DRIVE,
    description: 'Create a Google shared drive.',
    inputSchema: createSharedDriveSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async createSharedDrive(
    input: z.infer<typeof createSharedDriveSchema>,
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
      MCP_TOOLS.CREATE_SHARED_DRIVE,
    );

    // Execute the authorized operation.
    const drive = await this.googleDriveService.createSharedDrive(
      userId,
      input,
    );

    return {
      status: 'ok',
      drive,
    };
  }
}
