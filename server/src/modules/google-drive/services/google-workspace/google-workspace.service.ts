import { Injectable, BadRequestException } from '@nestjs/common';
import { GoogleDriveClientService } from '../drive/google-drive-client.service.js';

// Provides Google Docs, Sheets, and Slides document operations.
@Injectable()
export class GoogleWorkspaceService {
  constructor(private readonly clients: GoogleDriveClientService) {}

  // Creates a Google document and optionally adds initial text.

  async createDocument(
    userId: string,
    input: { title: string; text?: string; parentId?: string },
  ) {
    const docs = await this.clients.getDocsClient(userId);
    const created = await docs.documents.create({
      requestBody: { title: input.title },
    });
    const documentId = created.data.documentId;
    if (!documentId)
      throw new BadRequestException(
        'Google Docs did not return a document ID.',
      );

    if (input.parentId) {
      const drive = await this.clients.getClient(userId);
      await drive.files.update({
        fileId: documentId,
        addParents: input.parentId,
        fields: 'id, parents',
      });
    }

    if (input.text) {
      await docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            { insertText: { location: { index: 1 }, text: input.text } },
          ],
        },
      });
    }

    // Docs API does not return a web URL; retrieve Drive's canonical webViewLink.
    const drive = await this.clients.getClient(userId);
    const file = await drive.files.get({
      fileId: documentId,
      fields: 'id, name, webViewLink',
    });

    return {
      documentId,
      title: input.title,
      url: file.data.webViewLink ?? null,
    };
  }

  // Retrieves a Google document and its structural content.

  async getDocument(userId: string, documentId: string) {
    const docs = await this.clients.getDocsClient(userId);
    const response = await docs.documents.get({ documentId });
    return response.data;
  }

  // Inserts text into a Google document at the requested index.

  async insertDocumentText(
    userId: string,
    documentId: string,
    text: string,
    index = 1,
  ) {
    if (!Number.isInteger(index) || index < 1)
      throw new BadRequestException('index must be a positive integer.');
    const docs = await this.clients.getDocsClient(userId);
    const response = await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [{ insertText: { location: { index }, text } }],
      },
    });
    return response.data;
  }

  // Creates a Google spreadsheet and optionally adds a sheet.

  async createSpreadsheet(
    userId: string,
    input: { title: string; sheetTitle?: string; parentId?: string },
  ) {
    const sheets = await this.clients.getSheetsClient(userId);
    const created = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: input.title },
        sheets: input.sheetTitle
          ? [{ properties: { title: input.sheetTitle } }]
          : undefined,
      },
    });
    const spreadsheetId = created.data.spreadsheetId;
    if (!spreadsheetId)
      throw new BadRequestException(
        'Google Sheets did not return a spreadsheet ID.',
      );
    if (input.parentId) {
      const drive = await this.clients.getClient(userId);
      await drive.files.update({
        fileId: spreadsheetId,
        addParents: input.parentId,
        fields: 'id, parents',
      });
    }
    return {
      spreadsheetId,
      title: input.title,
      url: created.data.spreadsheetUrl,
    };
  }

  // Retrieves spreadsheet metadata and sheet information.

  async getSpreadsheet(userId: string, spreadsheetId: string) {
    const sheets = await this.clients.getSheetsClient(userId);
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: false,
    });
    return response.data;
  }

  // Reads cell values from the requested spreadsheet range.

  async getValues(userId: string, spreadsheetId: string, range: string) {
    const sheets = await this.clients.getSheetsClient(userId);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return {
      range: response.data.range,
      majorDimension: response.data.majorDimension,
      values: response.data.values ?? [],
    };
  }

  // Writes values to the requested spreadsheet range.

  async updateValues(
    userId: string,
    input: {
      spreadsheetId: string;
      range: string;
      values: Array<Array<string | number | boolean | null>>;
      valueInputOption?: 'RAW' | 'USER_ENTERED';
    },
  ) {
    const sheets = await this.clients.getSheetsClient(userId);
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: input.spreadsheetId,
      range: input.range,
      valueInputOption: input.valueInputOption ?? 'USER_ENTERED',
      requestBody: { values: input.values },
    });
    return response.data;
  }

  // Applies a batch of structural updates to a spreadsheet.

  async batchUpdateSpreadsheet(
    userId: string,
    spreadsheetId: string,
    requests: unknown[],
  ) {
    const sheets = await this.clients.getSheetsClient(userId);
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: requests as never[] },
    });
    return response.data;
  }

  // Creates a Google Slides presentation.

  async createPresentation(
    userId: string,
    input: { title: string; parentId?: string },
  ) {
    const slides = await this.clients.getSlidesClient(userId);
    const created = await slides.presentations.create({
      requestBody: { title: input.title },
    });
    const presentationId = created.data.presentationId;
    if (!presentationId)
      throw new BadRequestException(
        'Google Slides did not return a presentation ID.',
      );
    if (input.parentId) {
      const drive = await this.clients.getClient(userId);
      await drive.files.update({
        fileId: presentationId,
        addParents: input.parentId,
        fields: 'id, parents',
      });
    }
    // Slides API does not return a web URL; retrieve Drive's canonical webViewLink.
    const drive = await this.clients.getClient(userId);
    const file = await drive.files.get({
      fileId: presentationId,
      fields: 'id, name, webViewLink',
    });

    return {
      presentationId,
      title: input.title,
      url: file.data.webViewLink ?? null,
    };
  }

  // Retrieves a Google Slides presentation.

  async getPresentation(userId: string, presentationId: string) {
    const slides = await this.clients.getSlidesClient(userId);
    const response = await slides.presentations.get({ presentationId });
    return response.data;
  }

  // Applies a batch of updates to a presentation.

  async batchUpdatePresentation(
    userId: string,
    presentationId: string,
    requests: unknown[],
  ) {
    const slides = await this.clients.getSlidesClient(userId);
    const response = await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests: requests as never[] },
    });
    return response.data;
  }
}
