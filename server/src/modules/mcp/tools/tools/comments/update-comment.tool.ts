import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { CommentsService } from '../../../../google-drive/services/comments/comments.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { updateCommentSchema } from '../../schemas/comments.schema.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';

@Injectable()
export class UpdateCommentTool {
  constructor(
    private readonly googleDriveService: CommentsService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.UPDATE_COMMENT,
    description: 'Update a comment on a Google Drive file.',
    inputSchema: updateCommentSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  })
  async updateComment(
    input: z.infer<typeof updateCommentSchema>,
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
      MCP_TOOLS.UPDATE_COMMENT,
    );

    // Execute the authorized operation.
    const comment = await this.googleDriveService.updateComment(userId, input);

    return {
      status: 'ok',
      comment,
    };
  }
}
