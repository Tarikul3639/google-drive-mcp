import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { getSpreadsheetValuesSchema } from '../schemas/google-workspace.schema.js';

@Injectable()
export class GetSpreadsheetValuesTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.GET_SPREADSHEET_VALUES,
    description: 'Read a range of cells from Google Sheets.',
    inputSchema: getSpreadsheetValuesSchema,
  })
  async getSpreadsheetValues(
    input: z.infer<typeof getSpreadsheetValuesSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_SPREADSHEET_VALUES);
    return {
      status: 'ok',
      ...(await this.workspace.getValues(
        userId,
        input.spreadsheetId,
        input.range,
      )),
    };
  }
}
