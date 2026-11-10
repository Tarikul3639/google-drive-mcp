import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { createSpreadsheetSchema } from '../../schemas/google-workspace.schema.js';

@Injectable()
export class CreateSpreadsheetTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.CREATE_SPREADSHEET,
    description: 'Create a native Google Sheets spreadsheet.',
    inputSchema: createSpreadsheetSchema,
  })
  async createSpreadsheet(
    input: z.infer<typeof createSpreadsheetSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(ctx, MCP_TOOLS.CREATE_SPREADSHEET);
    return {
      status: 'ok',
      spreadsheet: await this.workspace.createSpreadsheet(userId, input),
    };
  }
}
