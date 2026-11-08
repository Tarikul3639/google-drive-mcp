import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { listFoldersSchema } from '../schemas/list-folders.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class ListFoldersTool {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly mcpToolAccessService: McpToolAccessService,
    ) {}

    @Tool({
        name: MCP_TOOLS.LIST_FOLDERS,
        description: "List folders in the authenticated user's Google Drive.",
        inputSchema: listFoldersSchema,
        annotations: {
            readOnlyHint: true,
            openWorldHint: true,
        },
    })
    async listFolders(input: z.infer<typeof listFoldersSchema>, ctx: McpContext) {
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
            MCP_TOOLS.LIST_FOLDERS,
        );

        // Execute the Drive operation only after authorization succeeds.
        const result = await this.googleDriveService.listFolders(userId, input.pageToken);

        return {
            status: 'ok',
            folders: result,
        };
    }
}
