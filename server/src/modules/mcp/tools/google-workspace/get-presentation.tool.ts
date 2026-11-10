import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { getPresentationSchema } from '../schemas/google-workspace.schema.js';

@Injectable()
export class GetPresentationTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.GET_PRESENTATION,
    description:
      'Get the structure and content of a Google Slides presentation.',
    inputSchema: getPresentationSchema,
  })
  async getPresentation(
    input: z.infer<typeof getPresentationSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_PRESENTATION);
    return {
      status: 'ok',
      presentation: await this.workspace.getPresentation(
        userId,
        input.presentationId,
      ),
    };
  }
}
