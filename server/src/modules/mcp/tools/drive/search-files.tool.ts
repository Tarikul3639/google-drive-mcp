import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { searchFilesSchema } from '../schemas/search-files.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class SearchFilesTool {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly mcpToolAccessService: McpToolAccessService,
    ) { }

    @Tool({
        name: MCP_TOOLS.SEARCH_FILES,
        description:
            'Search files by name or content in authenticated user Google Drive.',
        inputSchema: searchFilesSchema,
        annotations: {
            readOnlyHint: true,
        },
    })
    async searchFiles(input: z.infer<typeof searchFilesSchema>, ctx: McpContext) {
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

        // Verify that the user can access this client and the requested tool.
        await this.mcpToolAccessService.verifyToolAccess(
            userId,
            clientId,
            MCP_TOOLS.SEARCH_FILES,
        );

        // Search files only after authorization succeeds.
        const result = await this.googleDriveService.searchFiles(
            userId,
            input.query,
            input.pageToken,
        );

        return {
            status: 'ok',
            files: result.files,
            nextPageToken: result.nextPageToken,
        };
    }
}
