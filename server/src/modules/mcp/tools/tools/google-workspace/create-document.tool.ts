import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { createDocumentSchema } from '../../schemas/google-workspace.schema.js';

@Injectable()
export class CreateDocumentTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.CREATE_DOCUMENT,
    description:
      'Create a native Google Docs document, optionally with initial text and a parent folder.',
    inputSchema: createDocumentSchema,
  })
  async createDocument(
    input: z.infer<typeof createDocumentSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(ctx, MCP_TOOLS.CREATE_DOCUMENT);
    return {
      status: 'ok',
      document: await this.workspace.createDocument(userId, input),
    };
  }
}
