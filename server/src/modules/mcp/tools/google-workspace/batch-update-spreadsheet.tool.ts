import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { batchUpdateSpreadsheetSchema } from '../schemas/google-workspace.schema.js';

@Injectable()
export class BatchUpdateSpreadsheetTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.BATCH_UPDATE_SPREADSHEET,
    description:
      'Apply Google Sheets API batchUpdate requests such as formatting and sheet operations.',
    inputSchema: batchUpdateSpreadsheetSchema,
  })
  async batchUpdateSpreadsheet(
    input: z.infer<typeof batchUpdateSpreadsheetSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(
      ctx,
      MCP_TOOLS.BATCH_UPDATE_SPREADSHEET,
    );
    return {
      status: 'ok',
      result: await this.workspace.batchUpdateSpreadsheet(
        userId,
        input.spreadsheetId,
        input.requests,
      ),
    };
  }
}
