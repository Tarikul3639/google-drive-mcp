import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { listCommentsSchema } from '../schemas/list-comments.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class ListCommentsTool {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly mcpToolAccessService: McpToolAccessService,
    ) {}

    @Tool({
        name: MCP_TOOLS.LIST_COMMENTS,
        description: 'List comments on a Google Drive file.',
        inputSchema: listCommentsSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    })
    async listComments(input: z.infer<typeof listCommentsSchema>, ctx: McpContext) {
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
            MCP_TOOLS.LIST_COMMENTS,
        );

        // Execute the authorized operation.
        const comments = await this.googleDriveService.listComments(userId, input);

        return {
            status: 'ok',
            comments,
        };
    }
}
