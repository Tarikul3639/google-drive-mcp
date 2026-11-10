import { z } from 'zod';

// Validate tool arguments at the MCP boundary before calling Google APIs or file parsers.

export const createDocumentSchema = z.object({
  title: z.string().trim().min(1).max(255),
  text: z.string().optional(),
  parentId: z.string().trim().min(1).optional(),
});
export const getDocumentSchema = z.object({ documentId: z.string().trim().min(1) });
export const insertDocumentTextSchema = z.object({
  documentId: z.string().trim().min(1),
  text: z.string().min(1),
  index: z.number().int().positive().optional(),
});

export const createSpreadsheetSchema = z.object({
  title: z.string().trim().min(1).max(255),
  sheetTitle: z.string().trim().min(1).optional(),
  parentId: z.string().trim().min(1).optional(),
});
export const getSpreadsheetSchema = z.object({ spreadsheetId: z.string().trim().min(1) });
export const getSpreadsheetValuesSchema = z.object({
  spreadsheetId: z.string().trim().min(1),
  range: z.string().trim().min(1),
});
export const updateSpreadsheetValuesSchema = z.object({
  spreadsheetId: z.string().trim().min(1),
  range: z.string().trim().min(1),
  values: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))),
  valueInputOption: z.enum(['RAW', 'USER_ENTERED']).optional(),
});
export const batchUpdateSpreadsheetSchema = z.object({
  spreadsheetId: z.string().trim().min(1),
  requests: z.array(z.record(z.string(), z.unknown())).min(1),
});

export const createPresentationSchema = z.object({
  title: z.string().trim().min(1).max(255),
  parentId: z.string().trim().min(1).optional(),
});
export const getPresentationSchema = z.object({ presentationId: z.string().trim().min(1) });
export const batchUpdatePresentationSchema = z.object({
  presentationId: z.string().trim().min(1),
  requests: z.array(z.record(z.string(), z.unknown())).min(1),
});

export const readDocxSchema = z.object({ dataBase64: z.string().min(4) });
export const createDocxSchema = z.object({ paragraphs: z.array(z.string()) });
export const readXlsxSchema = z.object({ dataBase64: z.string().min(4) });
export const createXlsxSchema = z.object({
  sheets: z.array(z.object({
    name: z.string().trim().min(1).max(31),
    rows: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))),
  })).min(1),
});
export const createPptxSchema = z.object({
  title: z.string().trim().min(1),
  slides: z.array(z.object({ title: z.string().optional(), body: z.string().optional() })).min(1),
});
