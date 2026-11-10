import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { OfficeFileService } from '../../../../google-drive/services/office-document-processing/office-file.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { createDocxSchema } from '../../schemas/office-document-processing.schema.js';

@Injectable()
export class CreateDocxTool extends ToolAuthorizerBase {
  constructor(
    private readonly office: OfficeFileService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.CREATE_DOCX,
    description: 'Generate a DOCX file and return its base64 content.',
    inputSchema: createDocxSchema,
  })
  async createDocx(input: z.infer<typeof createDocxSchema>, ctx: McpContext) {
    await this.authorize(ctx, MCP_TOOLS.CREATE_DOCX);
    return this.office.createDocx(input);
  }
}
