import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { getSpreadsheetSchema } from '../schemas/google-workspace.schema.js';

@Injectable()
export class GetSpreadsheetTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.GET_SPREADSHEET,
    description: 'Get metadata and sheet structure from Google Sheets.',
    inputSchema: getSpreadsheetSchema,
  })
  async getSpreadsheet(
    input: z.infer<typeof getSpreadsheetSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_SPREADSHEET);
    return {
      status: 'ok',
      spreadsheet: await this.workspace.getSpreadsheet(
        userId,
        input.spreadsheetId,
      ),
    };
  }
}
