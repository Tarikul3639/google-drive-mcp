import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { batchUpdatePresentationSchema } from '../../schemas/google-workspace.schema.js';

@Injectable()
export class BatchUpdatePresentationTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.BATCH_UPDATE_PRESENTATION,
    description:
      'Apply Google Slides API batchUpdate requests to add or edit slides, shapes, text and images.',
    inputSchema: batchUpdatePresentationSchema,
  })
  async batchUpdatePresentation(
    input: z.infer<typeof batchUpdatePresentationSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(
      ctx,
      MCP_TOOLS.BATCH_UPDATE_PRESENTATION,
    );
    return {
      status: 'ok',
      result: await this.workspace.batchUpdatePresentation(
        userId,
        input.presentationId,
        input.requests,
      ),
    };
  }
}
