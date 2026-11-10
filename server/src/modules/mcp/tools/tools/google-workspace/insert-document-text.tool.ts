import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { insertDocumentTextSchema } from '../../schemas/google-workspace.schema.js';

@Injectable()
export class InsertDocumentTextTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.INSERT_DOCUMENT_TEXT,
    description: 'Insert text into a Google Docs document at a document index.',
    inputSchema: insertDocumentTextSchema,
  })
  async insertDocumentText(
    input: z.infer<typeof insertDocumentTextSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(ctx, MCP_TOOLS.INSERT_DOCUMENT_TEXT);
    return {
      status: 'ok',
      result: await this.workspace.insertDocumentText(
        userId,
        input.documentId,
        input.text,
        input.index,
      ),
    };
  }
}
