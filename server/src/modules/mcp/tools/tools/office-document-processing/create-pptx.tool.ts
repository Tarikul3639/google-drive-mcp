import { Injectable } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { OfficeFileService } from '../../../../google-drive/services/office-document-processing/office-file.service.js';
import { McpToolAccessService } from '../../services/mcp-tool-access.service.js';
import { MCP_TOOLS } from '../../constants/mcp-tools.constant.js';
import { ToolAuthorizerBase } from '../tool-authorizer.base.js';
import { createPptxSchema } from '../../schemas/office-document-processing.schema.js';

@Injectable()
export class CreatePptxTool extends ToolAuthorizerBase {
  constructor(
    private readonly office: OfficeFileService,
    access: McpToolAccessService,
  ) {
    super(access);
  }

  @Tool({
    name: MCP_TOOLS.CREATE_PPTX,
    description: 'Generate a PPTX presentation and return its base64 content.',
    inputSchema: createPptxSchema,
  })
  async createPptx(input: z.infer<typeof createPptxSchema>, ctx: McpContext) {
    await this.authorize(ctx, MCP_TOOLS.CREATE_PPTX);
    return this.office.createPptx(input);
  }
}
