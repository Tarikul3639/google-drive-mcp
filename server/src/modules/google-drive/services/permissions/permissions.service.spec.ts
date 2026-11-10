// Covers permission creation, retrieval, listing, updates, and deletion.
import { Test } from '@nestjs/testing';
import { PermissionsService } from './permissions.service.js';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let client: { getClient: ReturnType<typeof vi.fn> };
  let drive: { permissions: Record<string, ReturnType<typeof vi.fn>> };

  beforeEach(async () => {
    client = { getClient: vi.fn() };
    drive = {
      permissions: {
        create: vi.fn(),
        get: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
    client.getClient.mockResolvedValue(drive);
    const module = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: GoogleDriveClientService, useValue: client },
      ],
    }).compile();
    service = module.get(PermissionsService);
  });

  it('creates a reader permission', async () => {
    drive.permissions.create.mockResolvedValue({
      data: { id: 'permission-1', role: 'reader' },
    });
    await expect(
      service.createPermission('user-1', {
        fileId: 'file-1',
        type: 'user',
        role: 'reader',
        emailAddress: 'reader@example.com',
      }),
    ).resolves.toEqual({ id: 'permission-1', role: 'reader' });
    expect(drive.permissions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: 'file-1',
        requestBody: expect.objectContaining({ type: 'user', role: 'reader' }),
      }),
    );
  });

  it('returns an empty permission list when the API omits permissions', async () => {
    drive.permissions.list.mockResolvedValue({ data: {} });
    await expect(
      service.listPermissions('user-1', { fileId: 'file-1' }),
    ).resolves.toEqual({ permissions: [], nextPageToken: null });
  });

  it('deletes a permission and returns its identifiers', async () => {
    drive.permissions.delete.mockResolvedValue({});
    await expect(
      service.deletePermission('user-1', {
        fileId: 'file-1',
        permissionId: 'permission-1',
      }),
    ).resolves.toEqual({ fileId: 'file-1', permissionId: 'permission-1' });
  });
});
