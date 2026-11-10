import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { OfficeFileService } from '../../../google-drive/services/office-document-processing/office-file.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { readDocxSchema } from '../schemas/office-document-processing.schema.js';

@Injectable()
export class ReadDocxTool extends ToolAuthorizerBase {
  constructor(
    private readonly office: OfficeFileService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.READ_DOCX,
    description: 'Extract plain text from a base64-encoded DOCX file.',
    inputSchema: readDocxSchema,
    annotations: { readOnlyHint: true },
  })
  async readDocx(input: z.infer<typeof readDocxSchema>, ctx: McpContext) {
    await this.authorize(ctx, MCP_TOOLS.READ_DOCX);
    return this.office.readDocx(input.dataBase64);
  }
}
