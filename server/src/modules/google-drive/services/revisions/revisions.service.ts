import { Injectable } from '@nestjs/common';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

// Retrieves revision history and metadata for Google Drive files.
@Injectable()
export class RevisionsService {
  constructor(
    private readonly googleDriveClientService: GoogleDriveClientService,
  ) {}

  // Lists revisions available for a Drive file.
  async listRevisions(
    userId: string,
    input: {
      fileId: string;
      pageToken?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.revisions.list({
      fileId: input.fileId,
      pageSize: 100,
      pageToken: input.pageToken,
      fields:
        'nextPageToken, revisions(id, mimeType, modifiedTime, keepForever, published, size, exportLinks, lastModifyingUser)',
    });

    return {
      revisions: response.data.revisions ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
    };
  }

  // Retrieves metadata for a specific file revision.
  async getRevision(
    userId: string,
    input: {
      fileId: string;
      revisionId: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.revisions.get({
      fileId: input.fileId,
      revisionId: input.revisionId,
      fields:
        'id, mimeType, modifiedTime, keepForever, published, size, exportLinks, lastModifyingUser',
    });

    return response.data;
  }
}
