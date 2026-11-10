import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { RevisionsService } from '../../../../google-drive/services/revisions/revisions.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { listRevisionsSchema } from '../../schemas/revisions.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class ListRevisionsTool {
  constructor(
    private readonly googleDriveService: RevisionsService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.LIST_REVISIONS,
    description: 'List revisions of a Google Drive file.',
    inputSchema: listRevisionsSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async listRevisions(
    input: z.infer<typeof listRevisionsSchema>,
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
      MCP_TOOLS.LIST_REVISIONS,
    );

    // Execute the authorized operation.
    const revisions = await this.googleDriveService.listRevisions(
      userId,
      input,
    );

    return {
      status: 'ok',
      revisions,
    };
  }
}
