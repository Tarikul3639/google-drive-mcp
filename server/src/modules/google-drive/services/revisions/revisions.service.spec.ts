// Covers revision history listing and individual revision retrieval.
import { Test } from '@nestjs/testing';
import { RevisionsService } from './revisions.service.js';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

describe('RevisionsService', () => {
  let service: RevisionsService;
  let client: { getClient: ReturnType<typeof vi.fn> };
  let drive: {
    revisions: {
      list: ReturnType<typeof vi.fn>;
      get: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    client = { getClient: vi.fn() };
    drive = { revisions: { list: vi.fn(), get: vi.fn() } };
    client.getClient.mockResolvedValue(drive);
    const module = await Test.createTestingModule({
      providers: [
        RevisionsService,
        { provide: GoogleDriveClientService, useValue: client },
      ],
    }).compile();
    service = module.get(RevisionsService);
  });

  it('lists revisions and normalizes missing pagination values', async () => {
    drive.revisions.list.mockResolvedValue({
      data: { revisions: [{ id: 'revision-1' }] },
    });
    await expect(
      service.listRevisions('user-1', { fileId: 'file-1' }),
    ).resolves.toEqual({
      revisions: [{ id: 'revision-1' }],
      nextPageToken: null,
    });
  });

  it('returns an empty revision list when none are present', async () => {
    drive.revisions.list.mockResolvedValue({ data: {} });
    await expect(
      service.listRevisions('user-1', { fileId: 'file-1' }),
    ).resolves.toEqual({ revisions: [], nextPageToken: null });
  });

  it('retrieves a specific revision', async () => {
    drive.revisions.get.mockResolvedValue({
      data: { id: 'revision-1', keepForever: true },
    });
    await expect(
      service.getRevision('user-1', {
        fileId: 'file-1',
        revisionId: 'revision-1',
      }),
    ).resolves.toEqual({ id: 'revision-1', keepForever: true });
  });
});
