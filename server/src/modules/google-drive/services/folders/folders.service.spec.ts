// Covers folder listing, creation, validation, and lifecycle operations.
import { Test } from '@nestjs/testing';
import { FoldersService } from './folders.service.js';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

describe('FoldersService', () => {
  let service: FoldersService;
  let client: { getClient: ReturnType<typeof vi.fn> };
  let drive: { files: Record<string, ReturnType<typeof vi.fn>> };

  beforeEach(async () => {
    client = { getClient: vi.fn() };
    drive = {
      files: { list: vi.fn(), create: vi.fn(), get: vi.fn(), update: vi.fn() },
    };
    client.getClient.mockResolvedValue(drive);
    const module = await Test.createTestingModule({
      providers: [
        FoldersService,
        { provide: GoogleDriveClientService, useValue: client },
      ],
    }).compile();
    service = module.get(FoldersService);
  });

  it('returns folders with pagination defaults', async () => {
    drive.files.list.mockResolvedValue({
      data: { files: [{ id: 'folder-1' }] },
    });
    await expect(service.listFolders('user-1')).resolves.toEqual({
      folders: [{ id: 'folder-1' }],
      nextPageToken: null,
    });
  });

  it('creates a folder with the Google folder MIME type', async () => {
    drive.files.create.mockResolvedValue({ data: { id: 'folder-1' } });
    await service.createFolder('user-1', { name: 'Reports' });
    expect(drive.files.create).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: {
          name: 'Reports',
          mimeType: 'application/vnd.google-apps.folder',
          parents: undefined,
        },
      }),
    );
  });

  it('rejects renaming a non-folder', async () => {
    drive.files.get.mockResolvedValue({
      data: { mimeType: 'application/pdf' },
    });
    await expect(
      service.renameFolder('user-1', 'file-1', 'New name'),
    ).rejects.toThrow('The specified item is not a folder.');
    expect(drive.files.update).not.toHaveBeenCalled();
  });

  it('renames a folder after validating its MIME type', async () => {
    drive.files.get.mockResolvedValue({
      data: { mimeType: 'application/vnd.google-apps.folder' },
    });
    drive.files.update.mockResolvedValue({
      data: { id: 'folder-1', name: 'Renamed' },
    });
    await expect(
      service.renameFolder('user-1', 'folder-1', 'Renamed'),
    ).resolves.toEqual({ id: 'folder-1', name: 'Renamed' });
  });
});
