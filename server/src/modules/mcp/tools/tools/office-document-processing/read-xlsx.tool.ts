import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { OfficeFileService } from '../../../../google-drive/services/office-document-processing/office-file.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { readXlsxSchema } from '../../schemas/office-document-processing.schema.js';

@Injectable()
export class ReadXlsxTool extends ToolAuthorizerBase {
  constructor(
    private readonly office: OfficeFileService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.READ_XLSX,
    description:
      'Read sheets and cell values from a base64-encoded XLSX/XLS file.',
    inputSchema: readXlsxSchema,
    annotations: { readOnlyHint: true },
  })
  async readXlsx(input: z.infer<typeof readXlsxSchema>, ctx: McpContext) {
    await this.authorize(ctx, MCP_TOOLS.READ_XLSX);
    return this.office.readXlsx(input.dataBase64);
  }
}
