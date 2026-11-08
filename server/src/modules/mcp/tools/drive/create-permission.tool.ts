import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';

import { GoogleDriveService } from '../../../google-drive/services/google-drive.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { createPermissionSchema } from '../schemas/create-permission.schema.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';

@Injectable()
export class CreatePermissionTool {
    constructor(
        private readonly googleDriveService: GoogleDriveService,
        private readonly mcpToolAccessService: McpToolAccessService,
    ) {}

    @Tool({
        name: MCP_TOOLS.CREATE_PERMISSION,
        description: 'Create a permission on a Google Drive file or folder.',
        inputSchema: createPermissionSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    })
    async createPermission(input: z.infer<typeof createPermissionSchema>, ctx: McpContext) {
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
            MCP_TOOLS.CREATE_PERMISSION,
        );

        // Execute the authorized permission operation.
        const permission = await this.googleDriveService.createPermission(userId, input);

        return {
            status: 'ok',
            permission,
        };
    }
}
