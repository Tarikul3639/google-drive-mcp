import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { OfficeFileService } from '../../../../google-drive/services/office-document-processing/office-file.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { createXlsxSchema } from '../../schemas/office-document-processing.schema.js';

@Injectable()
export class CreateXlsxTool extends ToolAuthorizerBase {
  constructor(
    private readonly office: OfficeFileService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.CREATE_XLSX,
    description: 'Generate an XLSX workbook and return its base64 content.',
    inputSchema: createXlsxSchema,
  })
  async createXlsx(input: z.infer<typeof createXlsxSchema>, ctx: McpContext) {
    await this.authorize(ctx, MCP_TOOLS.CREATE_XLSX);
    return this.office.createXlsx(input);
  }
}
