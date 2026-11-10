import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Tool, type McpContext } from '@nestjs/mcp';
import { z } from 'zod';
import { GoogleWorkspaceService } from '../../../google-drive/services/google-workspace.service.js';
import { OfficeFileService } from '../../../google-drive/services/office-file.service.js';
import { McpToolAccessService } from '../services/mcp-tool-access.service.js';
import { MCP_TOOLS, type McpToolName } from '../constants/mcp-tools.constant.js';
import {
  createDocumentSchema, getDocumentSchema, insertDocumentTextSchema,
  createSpreadsheetSchema, getSpreadsheetSchema, getSpreadsheetValuesSchema,
  updateSpreadsheetValuesSchema, batchUpdateSpreadsheetSchema,
  createPresentationSchema, getPresentationSchema, batchUpdatePresentationSchema,
  readDocxSchema, createDocxSchema, readXlsxSchema, createXlsxSchema, createPptxSchema,
} from '../schemas/workspace.schema.js';

@Injectable()
export class WorkspaceTools {
  constructor(
    private readonly workspace: GoogleWorkspaceService,
    private readonly office: OfficeFileService,
    private readonly access: McpToolAccessService,
  ) {}

  // Resolve the authenticated user and enforce this MCP client's per-tool permission.
  private async authorize(ctx: McpContext, toolName: McpToolName): Promise<string> {
    const userId = ctx.authInfo?.extra?.userId;
    const clientId = ctx.authInfo?.clientId;
    if (typeof userId !== 'string' || !userId || typeof clientId !== 'string' || !clientId) {
      throw new UnauthorizedException('Authentication required.');
    }
    await this.access.verifyToolAccess(userId, clientId, toolName);
    return userId;
  }

  @Tool({ name: MCP_TOOLS.CREATE_DOCUMENT, description: 'Create a native Google Docs document, optionally with initial text and a parent folder.', inputSchema: createDocumentSchema })
  async createDocument(input: z.infer<typeof createDocumentSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.CREATE_DOCUMENT);
    return { status: 'ok', document: await this.workspace.createDocument(userId, input) };
  }

  @Tool({ name: MCP_TOOLS.GET_DOCUMENT, description: 'Get the content and structure of a Google Docs document.', inputSchema: getDocumentSchema, annotations: { readOnlyHint: true } })
  async getDocument(input: z.infer<typeof getDocumentSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_DOCUMENT);
    return { status: 'ok', document: await this.workspace.getDocument(userId, input.documentId) };
  }

  @Tool({ name: MCP_TOOLS.INSERT_DOCUMENT_TEXT, description: 'Insert text into a Google Docs document at a document index.', inputSchema: insertDocumentTextSchema })
  async insertDocumentText(input: z.infer<typeof insertDocumentTextSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.INSERT_DOCUMENT_TEXT);
    return { status: 'ok', result: await this.workspace.insertDocumentText(userId, input.documentId, input.text, input.index) };
  }

  @Tool({ name: MCP_TOOLS.CREATE_SPREADSHEET, description: 'Create a native Google Sheets spreadsheet.', inputSchema: createSpreadsheetSchema })
  async createSpreadsheet(input: z.infer<typeof createSpreadsheetSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.CREATE_SPREADSHEET);
    return { status: 'ok', spreadsheet: await this.workspace.createSpreadsheet(userId, input) };
  }

  @Tool({ name: MCP_TOOLS.GET_SPREADSHEET, description: 'Get metadata and sheet structure from Google Sheets.', inputSchema: getSpreadsheetSchema, annotations: { readOnlyHint: true } })
  async getSpreadsheet(input: z.infer<typeof getSpreadsheetSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_SPREADSHEET);
    return { status: 'ok', spreadsheet: await this.workspace.getSpreadsheet(userId, input.spreadsheetId) };
  }

  @Tool({ name: MCP_TOOLS.GET_SPREADSHEET_VALUES, description: 'Read a range of cells from Google Sheets.', inputSchema: getSpreadsheetValuesSchema, annotations: { readOnlyHint: true } })
  async getSpreadsheetValues(input: z.infer<typeof getSpreadsheetValuesSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_SPREADSHEET_VALUES);
    return { status: 'ok', ...await this.workspace.getValues(userId, input.spreadsheetId, input.range) };
  }

  @Tool({ name: MCP_TOOLS.UPDATE_SPREADSHEET_VALUES, description: 'Write a two-dimensional array of values to a Google Sheets range.', inputSchema: updateSpreadsheetValuesSchema })
  async updateSpreadsheetValues(input: z.infer<typeof updateSpreadsheetValuesSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.UPDATE_SPREADSHEET_VALUES);
    return { status: 'ok', result: await this.workspace.updateValues(userId, input) };
  }

  // Expose the Google Sheets batch API for formatting and structural operations not covered by values.update.
  @Tool({ name: MCP_TOOLS.BATCH_UPDATE_SPREADSHEET, description: 'Apply Google Sheets API batchUpdate requests such as formatting and sheet operations.', inputSchema: batchUpdateSpreadsheetSchema })
  async batchUpdateSpreadsheet(input: z.infer<typeof batchUpdateSpreadsheetSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.BATCH_UPDATE_SPREADSHEET);
    return { status: 'ok', result: await this.workspace.batchUpdateSpreadsheet(userId, input.spreadsheetId, input.requests) };
  }

  @Tool({ name: MCP_TOOLS.CREATE_PRESENTATION, description: 'Create a native Google Slides presentation.', inputSchema: createPresentationSchema })
  async createPresentation(input: z.infer<typeof createPresentationSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.CREATE_PRESENTATION);
    return { status: 'ok', presentation: await this.workspace.createPresentation(userId, input) };
  }

  @Tool({ name: MCP_TOOLS.GET_PRESENTATION, description: 'Get the structure and content of a Google Slides presentation.', inputSchema: getPresentationSchema, annotations: { readOnlyHint: true } })
  async getPresentation(input: z.infer<typeof getPresentationSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.GET_PRESENTATION);
    return { status: 'ok', presentation: await this.workspace.getPresentation(userId, input.presentationId) };
  }

  @Tool({ name: MCP_TOOLS.BATCH_UPDATE_PRESENTATION, description: 'Apply Google Slides API batchUpdate requests to add or edit slides, shapes, text and images.', inputSchema: batchUpdatePresentationSchema })
  async batchUpdatePresentation(input: z.infer<typeof batchUpdatePresentationSchema>, ctx: McpContext) {
    const userId = await this.authorize(ctx, MCP_TOOLS.BATCH_UPDATE_PRESENTATION);
    return { status: 'ok', result: await this.workspace.batchUpdatePresentation(userId, input.presentationId, input.requests) };
  }

  // Office-file tools operate on base64 payloads; callers can upload/download the resulting bytes with Drive tools.
  @Tool({ name: MCP_TOOLS.READ_DOCX, description: 'Extract plain text from a base64-encoded DOCX file.', inputSchema: readDocxSchema, annotations: { readOnlyHint: true } })
  readDocx(input: z.infer<typeof readDocxSchema>) { return this.office.readDocx(input.dataBase64); }

  @Tool({ name: MCP_TOOLS.CREATE_DOCX, description: 'Generate a DOCX file and return its base64 content.', inputSchema: createDocxSchema })
  createDocx(input: z.infer<typeof createDocxSchema>) { return this.office.createDocx(input); }

  @Tool({ name: MCP_TOOLS.READ_XLSX, description: 'Read sheets and cell values from a base64-encoded XLSX/XLS file.', inputSchema: readXlsxSchema, annotations: { readOnlyHint: true } })
  readXlsx(input: z.infer<typeof readXlsxSchema>) { return this.office.readXlsx(input.dataBase64); }

  @Tool({ name: MCP_TOOLS.CREATE_XLSX, description: 'Generate an XLSX workbook and return its base64 content.', inputSchema: createXlsxSchema })
  createXlsx(input: z.infer<typeof createXlsxSchema>) { return this.office.createXlsx(input); }

  @Tool({ name: MCP_TOOLS.CREATE_PPTX, description: 'Generate a PPTX presentation and return its base64 content.', inputSchema: createPptxSchema })
  createPptx(input: z.infer<typeof createPptxSchema>) { return this.office.createPptx(input); }
}
