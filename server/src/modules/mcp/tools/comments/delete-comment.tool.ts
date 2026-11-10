import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { CommentsService } from '../../../google-drive/services/comments/comments.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { deleteCommentSchema } from '../schemas/comments.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class DeleteCommentTool {
  constructor(
    private readonly googleDriveService: CommentsService,
    private readonly mcpToolAccessService: McpToolAccessService,
  ) {}

  @Tool({
    name: MCP_TOOLS.DELETE_COMMENT,
    description: 'Delete a comment from a Google Drive file.',
    inputSchema: deleteCommentSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  })
  async deleteComment(
    input: z.infer<typeof deleteCommentSchema>,
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
      MCP_TOOLS.DELETE_COMMENT,
    );

    // Execute the authorized operation.
    const result = await this.googleDriveService.deleteComment(userId, input);

    return {
      status: 'ok',
      result,
    };
  }
}
