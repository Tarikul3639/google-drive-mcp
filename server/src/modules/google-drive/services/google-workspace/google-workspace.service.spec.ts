// Covers Google Docs, Sheets, and Slides operations.
import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { GoogleWorkspaceService } from './google-workspace.service.js';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

describe('GoogleWorkspaceService', () => {
  let service: GoogleWorkspaceService;
  let clients: Record<string, ReturnType<typeof vi.fn>>;
  let docs: { documents: Record<string, ReturnType<typeof vi.fn>> };
  let sheets: {
    spreadsheets: {
      create: ReturnType<typeof vi.fn>;
      get: ReturnType<typeof vi.fn>;
      values: {
        get: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
      };
      batchUpdate: ReturnType<typeof vi.fn>;
    };
  };
  let slides: { presentations: Record<string, ReturnType<typeof vi.fn>> };
  let drive: {
    files: { get: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
  };

  beforeEach(async () => {
    docs = {
      documents: { create: vi.fn(), get: vi.fn(), batchUpdate: vi.fn() },
    };
    sheets = {
      spreadsheets: {
        create: vi.fn(),
        get: vi.fn(),
        values: { get: vi.fn(), update: vi.fn() },
        batchUpdate: vi.fn(),
      },
    };
    slides = {
      presentations: { create: vi.fn(), get: vi.fn(), batchUpdate: vi.fn() },
    };
    drive = { files: { get: vi.fn(), update: vi.fn() } };
    clients = {
      getDocsClient: vi.fn().mockResolvedValue(docs),
      getSheetsClient: vi.fn().mockResolvedValue(sheets),
      getSlidesClient: vi.fn().mockResolvedValue(slides),
      getClient: vi.fn().mockResolvedValue(drive),
    };
    const module = await Test.createTestingModule({
      providers: [
        GoogleWorkspaceService,
        { provide: GoogleDriveClientService, useValue: clients },
      ],
    }).compile();
    service = module.get(GoogleWorkspaceService);
  });

  it('creates a document and returns its Drive URL', async () => {
    docs.documents.create.mockResolvedValue({ data: { documentId: 'doc-1' } });
    docs.documents.batchUpdate.mockResolvedValue({ data: {} });
    drive.files.get.mockResolvedValue({
      data: { webViewLink: 'https://drive.google.com/doc-1' },
    });
    await expect(
      service.createDocument('user-1', { title: 'Notes', text: 'Hello' }),
    ).resolves.toEqual({
      documentId: 'doc-1',
      title: 'Notes',
      url: 'https://drive.google.com/doc-1',
    });
    expect(docs.documents.batchUpdate).toHaveBeenCalled();
  });

  it('rejects a document creation response without an ID', async () => {
    docs.documents.create.mockResolvedValue({ data: {} });
    await expect(
      service.createDocument('user-1', { title: 'Notes' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('validates document insertion index', async () => {
    await expect(
      service.insertDocumentText('user-1', 'doc-1', 'Hi', 0),
    ).rejects.toThrow(BadRequestException);
    expect(clients.getDocsClient).not.toHaveBeenCalled();
  });

  it('returns an empty values array when a sheet range has no values', async () => {
    sheets.spreadsheets.values.get.mockResolvedValue({
      data: { range: 'Sheet1!A1:B2' },
    });
    await expect(
      service.getValues('user-1', 'sheet-1', 'Sheet1!A1:B2'),
    ).resolves.toEqual({
      range: 'Sheet1!A1:B2',
      majorDimension: undefined,
      values: [],
    });
  });

  it('creates a presentation and returns its Drive URL', async () => {
    slides.presentations.create.mockResolvedValue({
      data: { presentationId: 'slides-1' },
    });
    drive.files.get.mockResolvedValue({
      data: { webViewLink: 'https://drive.google.com/slides-1' },
    });
    await expect(
      service.createPresentation('user-1', { title: 'Quarterly review' }),
    ).resolves.toEqual({
      presentationId: 'slides-1',
      title: 'Quarterly review',
      url: 'https://drive.google.com/slides-1',
    });
  });
});
