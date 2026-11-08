import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { getCommentSchema } from '../schemas/get-comment.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class GetCommentTool {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly mcpToolAccessService: McpToolAccessService,
    ) {}

    @Tool({
        name: MCP_TOOLS.GET_COMMENT,
        description: 'Get a comment from a Google Drive file.',
        inputSchema: getCommentSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    })
    async getComment(input: z.infer<typeof getCommentSchema>, ctx: McpContext) {
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
            MCP_TOOLS.GET_COMMENT,
        );

        // Execute the authorized operation.
        const comment = await this.googleDriveService.getComment(userId, input);

        return {
            status: 'ok',
            comment,
        };
    }
}
