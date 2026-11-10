import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../../google-drive/services/google-workspace/google-workspace.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { updateSpreadsheetValuesSchema } from '../../schemas/google-workspace.schema.js';

@Injectable()
export class UpdateSpreadsheetValuesTool extends ToolAuthorizerBase {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.UPDATE_SPREADSHEET_VALUES,
    description:
      'Write a two-dimensional array of values to a Google Sheets range.',
    inputSchema: updateSpreadsheetValuesSchema,
  })
  async updateSpreadsheetValues(
    input: z.infer<typeof updateSpreadsheetValuesSchema>,
    ctx: McpContext,
  ) {
    const userId = await this.authorize(
      ctx,
      MCP_TOOLS.UPDATE_SPREADSHEET_VALUES,
    );
    return {
      status: 'ok',
      result: await this.workspace.updateValues(userId, input),
    };
  }
}
