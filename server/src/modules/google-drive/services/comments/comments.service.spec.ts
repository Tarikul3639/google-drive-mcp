// Covers comment CRUD operations and pagination.
import { Test } from '@nestjs/testing';
import { CommentsService } from './comments.service.js';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

describe('CommentsService', () => {
  let service: CommentsService;
  let client: { getClient: ReturnType<typeof vi.fn> };
  let drive: { comments: Record<string, ReturnType<typeof vi.fn>> };

  beforeEach(async () => {
    client = { getClient: vi.fn() };
    drive = {
      comments: {
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
        CommentsService,
        { provide: GoogleDriveClientService, useValue: client },
      ],
    }).compile();
    service = module.get(CommentsService);
  });

  it('creates a comment and returns the API response', async () => {
    drive.comments.create.mockResolvedValue({
      data: { id: 'comment-1', content: 'Hello' },
    });
    await expect(
      service.createComment('user-1', { fileId: 'file-1', content: 'Hello' }),
    ).resolves.toEqual({ id: 'comment-1', content: 'Hello' });
    expect(drive.comments.create).toHaveBeenCalledWith(
      expect.objectContaining({
        fileId: 'file-1',
        requestBody: expect.objectContaining({ content: 'Hello' }),
      }),
    );
  });

  it('returns an empty comment list and null page token when omitted by the API', async () => {
    drive.comments.list.mockResolvedValue({ data: {} });
    await expect(
      service.listComments('user-1', { fileId: 'file-1' }),
    ).resolves.toEqual({ comments: [], nextPageToken: null });
  });

  it('deletes a comment and returns its identifiers', async () => {
    drive.comments.delete.mockResolvedValue({});
    await expect(
      service.deleteComment('user-1', {
        fileId: 'file-1',
        commentId: 'comment-1',
      }),
    ).resolves.toEqual({ fileId: 'file-1', commentId: 'comment-1' });
  });
});
