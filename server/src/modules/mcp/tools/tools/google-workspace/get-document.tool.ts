import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { getDocumentSchema } from '../../schemas/google-workspace.schema.js';

@Injectable()
export class GetDocumentTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.GET_DOCUMENT,
    description: 'Get the content and structure of a Google Docs document.',
    inputSchema: getDocumentSchema,
  })
  async getDocument(input: z.infer<typeof getDocumentSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_DOCUMENT);
    return {
      status: 'ok',
      document: await this.workspace.getDocument(userId, input.documentId),
    };
  }
}
