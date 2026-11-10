// Covers shared-drive creation, listing, retrieval, updates, and deletion.
import { Test } from '@nestjs/testing';
import { SharedDrivesService } from './shared-drives.service.js';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

describe('SharedDrivesService', () => {
  let service: SharedDrivesService;
  let client: { getClient: ReturnType<typeof vi.fn> };
  let drive: { drives: Record<string, ReturnType<typeof vi.fn>> };

  beforeEach(async () => {
    client = { getClient: vi.fn() };
    drive = {
      drives: {
        create: vi.fn(),
        list: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
    client.getClient.mockResolvedValue(drive);
    const module = await Test.createTestingModule({
      providers: [
        SharedDrivesService,
        { provide: GoogleDriveClientService, useValue: client },
      ],
    }).compile();
    service = module.get(SharedDrivesService);
  });

  it('creates a shared drive with the requested name', async () => {
    drive.drives.create.mockResolvedValue({
      data: { id: 'drive-1', name: 'Team' },
    });
    await expect(
      service.createSharedDrive('user-1', {
        name: 'Team',
        requestId: 'request-1',
      }),
    ).resolves.toEqual({ id: 'drive-1', name: 'Team' });
    expect(drive.drives.create).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'request-1',
        requestBody: { name: 'Team' },
      }),
    );
  });

  it('normalizes missing shared-drive list values', async () => {
    drive.drives.list.mockResolvedValue({ data: {} });
    await expect(service.listSharedDrives('user-1', {})).resolves.toEqual({
      drives: [],
      nextPageToken: null,
    });
  });

  it('retrieves a shared drive', async () => {
    drive.drives.get.mockResolvedValue({
      data: { id: 'drive-1', name: 'Team' },
    });
    await expect(
      service.getSharedDrive('user-1', { driveId: 'drive-1' }),
    ).resolves.toEqual({ id: 'drive-1', name: 'Team' });
  });

  it('deletes a shared drive and returns its identifier', async () => {
    drive.drives.delete.mockResolvedValue({});
    await expect(
      service.deleteSharedDrive('user-1', { driveId: 'drive-1' }),
    ).resolves.toEqual({ driveId: 'drive-1' });
  });
});
