// Covers the Google Drive file service behavior and API error handling.
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { FilesService } from './files.service.js';
import { GoogleDriveClientService } from '../drive/google-drive-client.service.js';

// Covers the Google Drive file service behavior and API error handling.
describe('FilesService', () => {
  let service: FilesService;

  let googleDriveClientService: {
    getClient: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    googleDriveClientService = {
      getClient: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: GoogleDriveClientService,
          useValue: googleDriveClientService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listFiles', () => {
    it('should return files successfully', async () => {
      const mockFiles = [
        {
          id: 'file-1',
          name: 'document.pdf',
          mimeType: 'application/pdf',
        },
        {
          id: 'file-2',
          name: 'image.png',
          mimeType: 'image/png',
        },
      ];

      const mockDrive = {
        files: {
          list: vi.fn().mockResolvedValue({
            data: {
              files: mockFiles,
            },
          }),
        },
      };

      googleDriveClientService.getClient.mockResolvedValue(mockDrive);

      const result = await service.listFiles('user-123');

      expect(result).toEqual({
        files: mockFiles,
        nextPageToken: null,
      });

      expect(googleDriveClientService.getClient).toHaveBeenCalledWith(
        'user-123',
      );

      expect(mockDrive.files.list).toHaveBeenCalledWith({
        pageSize: 50,
        pageToken: undefined,
        q: 'trashed = false',
        orderBy: 'modifiedTime desc',
        fields: 'nextPageToken, files(id, name, mimeType, webViewLink)',
      });
    });

    it('should return empty array when no files exist', async () => {
      const mockDrive = {
        files: {
          list: vi.fn().mockResolvedValue({
            data: {
              files: null,
            },
          }),
        },
      };

      googleDriveClientService.getClient.mockResolvedValue(mockDrive);

      const result = await service.listFiles('user-123');

      expect(result).toEqual({
        files: [],
        nextPageToken: null,
      });
    });

    it('should propagate NotFoundException', async () => {
      googleDriveClientService.getClient.mockRejectedValue(
        new NotFoundException('Google Drive account is not connected.'),
      );

      await expect(service.listFiles('user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should propagate UnauthorizedException', async () => {
      googleDriveClientService.getClient.mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(service.listFiles('user-123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should propagate Google Drive API errors', async () => {
      const mockDrive = {
        files: {
          list: vi.fn().mockRejectedValue(new Error('Google Drive API error')),
        },
      };

      googleDriveClientService.getClient.mockResolvedValue(mockDrive);

      await expect(service.listFiles('user-123')).rejects.toThrow(
        'Google Drive API error',
      );
    });
  });
});
