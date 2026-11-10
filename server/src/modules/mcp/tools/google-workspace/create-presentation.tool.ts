import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { createPresentationSchema } from '../schemas/google-workspace.schema.js';

@Injectable()
export class CreatePresentationTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.CREATE_PRESENTATION,
    description: 'Create a native Google Slides presentation.',
    inputSchema: createPresentationSchema,
  })
  async createPresentation(
    input: z.infer<typeof createPresentationSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(ctx, MCP_TOOLS.CREATE_PRESENTATION);
    return {
      status: 'ok',
      presentation: await this.workspace.createPresentation(userId, input),
    };
  }
}
