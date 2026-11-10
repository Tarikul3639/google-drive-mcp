import { Injectable, BadRequestException } from '@nestjs/common';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';

// Keep the public result type independent from Mammoth's internal declaration types.
type DocxReadResult = {
  text: string;
  messages: Array<{ type: string; message: string }>;
};

// Office files are processed locally; methods accept and return base64 so MCP can transport binary data.
@Injectable()
export class OfficeFileService {
  // Mammoth extracts readable plain text; it does not preserve the full DOCX layout or styling.
  async readDocx(dataBase64: string): Promise<DocxReadResult> {
    const buffer = this.decode(dataBase64);
    const result = await mammoth.extractRawText({ buffer });
    return {
      text: result.value,
      messages: result.messages.map(({ type, message }) => ({ type, message })),
    };
  }

  async createDocx(input: { paragraphs: string[] }) {
    const document = new Document({
      sections: [{ children: input.paragraphs.map((text) => new Paragraph({ children: [new TextRun(text)] })) }],
    });
    const buffer = await Packer.toBuffer(document);
    return { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', dataBase64: buffer.toString('base64') };
  }

  // Return each worksheet as a two-dimensional array, retaining the workbook's sheet order.
  readXlsx(dataBase64: string) {
    const workbook = XLSX.read(this.decode(dataBase64), { type: 'buffer', cellDates: true });
    return {
      sheets: workbook.SheetNames.map((name) => ({
        name,
        rows: XLSX.utils.sheet_to_json(workbook.Sheets[name]!, { header: 1, raw: true }),
      })),
    };
  }

  createXlsx(input: { sheets: Array<{ name: string; rows: Array<Array<string | number | boolean | null>> }> }) {
    const workbook = XLSX.utils.book_new();
    for (const sheet of input.sheets) {
      const worksheet = XLSX.utils.aoa_to_sheet(sheet.rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31));
    }
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dataBase64: buffer.toString('base64') };
  }

  async createPptx(input: { title: string; slides: Array<{ title?: string; body?: string }> }) {
    const presentation = new pptxgen();
    presentation.subject = input.title;
    presentation.title = input.title;
    presentation.layout = 'LAYOUT_WIDE';
    for (const slideInput of input.slides) {
      const slide = presentation.addSlide();
      if (slideInput.title) slide.addText(slideInput.title, { x: 0.6, y: 0.5, w: 12, h: 0.8, fontSize: 28, bold: true });
      if (slideInput.body) slide.addText(slideInput.body, { x: 0.8, y: 1.6, w: 11.5, h: 4.8, fontSize: 18, breakLine: false });
    }
    const data = await presentation.write({ outputType: 'nodebuffer' });
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
    return { mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', dataBase64: buffer.toString('base64') };
  }

  // Accept either raw base64 or a data URL, and reject malformed input before parsing.
  private decode(value: string): Buffer {
    const normalized = value.replace(/^data:[^;]+;base64,/, '');
    if (!normalized || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(normalized)) {
      throw new BadRequestException('Invalid base64 file content.');
    }
    return Buffer.from(normalized, 'base64');
  }
}
