import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { deleteFolderSchema } from '../schemas/delete-folder.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class DeleteFolderTool {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly mcpToolAccessService: McpToolAccessService,
    ) {}

    @Tool({
        name: MCP_TOOLS.DELETE_FOLDER,
        description: "Permanently delete a folder from the authenticated user's Google Drive.",
        inputSchema: deleteFolderSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: true,
        },
    })
    async deleteFolder(input: z.infer<typeof deleteFolderSchema>, ctx: McpContext) {
        // Extract authenticated user and OAuth client IDs from the token.
        const userId = ctx.authInfo?.extra?.userId;
        const clientId = ctx.authInfo?.clientId;

        // Ensure the request contains valid authentication context.
        if (
            typeof userId !== 'string' ||
            !userId ||
            typeof clientId !== 'string' ||
            !clientId
        ) {
            throw new UnauthorizedException('Authentication required.');
        }

        // Verify tool access before executing the requested Drive operation.
        await this.mcpToolAccessService.verifyToolAccess(
            userId,
            clientId,
            MCP_TOOLS.DELETE_FOLDER,
        );

        await this.googleDriveService.deleteFolder(userId, input.folderId);

        return {
            status: 'ok',
            deleted: true,
        };
    }
}
