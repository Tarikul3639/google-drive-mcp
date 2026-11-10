// Covers local DOCX, XLSX, and PPTX file processing.
import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OfficeFileService } from './office-file.service.js';

describe('OfficeFileService', () => {
  let service: OfficeFileService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OfficeFileService],
    }).compile();
    service = module.get(OfficeFileService);
  });

  it('rejects invalid base64 when reading DOCX content', async () => {
    await expect(service.readDocx('not base64!')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects invalid base64 when reading XLSX content', () => {
    expect(() => service.readXlsx('not base64!')).toThrow(BadRequestException);
  });

  it('creates an XLSX workbook that can be read back', () => {
    const created = service.createXlsx({
      sheets: [
        {
          name: 'Data',
          rows: [
            ['Name', 'Count'],
            ['Item', 3],
          ],
        },
      ],
    });
    const parsed = service.readXlsx(created.dataBase64);
    expect(created.mimeType).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(parsed.sheets).toEqual([
      {
        name: 'Data',
        rows: [
          ['Name', 'Count'],
          ['Item', 3],
        ],
      },
    ]);
  });

  it('creates a DOCX file', async () => {
    const created = await service.createDocx({
      paragraphs: ['Hello', 'World'],
    });
    expect(created.mimeType).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    expect(created.dataBase64).toBeTruthy();
  });

  it('creates a PPTX file', async () => {
    const created = await service.createPptx({
      title: 'Deck',
      slides: [{ title: 'Intro', body: 'Welcome' }],
    });
    expect(created.mimeType).toBe(
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    );
    expect(created.dataBase64).toBeTruthy();
  });
});
