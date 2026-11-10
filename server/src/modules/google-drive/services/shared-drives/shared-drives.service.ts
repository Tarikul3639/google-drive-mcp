import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GoogleDriveClientService } from '../google-drive-client.service.js';
import {
  sharedDriveFields,
  sharedDriveListFields,
} from '../google-drive-fields.js';

// Manages shared-drive creation, discovery, metadata, updates, and deletion.
@Injectable()
export class SharedDrivesService {
  constructor(
    private readonly googleDriveClientService: GoogleDriveClientService,
  ) {}

  // Creates a shared drive with a unique request ID.
  async createSharedDrive(
    userId: string,
    input: {
      name: string;
      requestId?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.drives.create({
      requestId: input.requestId ?? randomUUID(),
      requestBody: { name: input.name },
      fields: sharedDriveFields(
        'id',
        'name',
        'colorRgb',
        'createdTime',
        'hidden',
      ),
    });

    return response.data;
  }

  // Lists shared drives available to the authenticated user.
  async listSharedDrives(
    userId: string,
    input: {
      pageToken?: string;
      pageSize?: number;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.drives.list({
      pageSize: input.pageSize ?? 100,
      pageToken: input.pageToken,
      fields: `${sharedDriveListFields('nextPageToken', 'drives')}, drives(${sharedDriveFields('id', 'name', 'colorRgb', 'createdTime', 'hidden')})`,
    });

    return {
      drives: response.data.drives ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
    };
  }

  // Retrieves metadata and capabilities for a shared drive.
  async getSharedDrive(userId: string, input: { driveId: string }) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.drives.get({
      driveId: input.driveId,
      fields: sharedDriveFields(
        'id',
        'name',
        'colorRgb',
        'createdTime',
        'hidden',
        'restrictions',
        'capabilities',
      ),
    });

    return response.data;
  }

  // Updates shared-drive metadata.
  async updateSharedDrive(
    userId: string,
    input: {
      driveId: string;
      name: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.drives.update({
      driveId: input.driveId,
      requestBody: { name: input.name },
      fields: sharedDriveFields(
        'id',
        'name',
        'colorRgb',
        'createdTime',
        'hidden',
        'restrictions',
      ),
    });

    return response.data;
  }

  // Deletes a shared drive.
  async deleteSharedDrive(userId: string, input: { driveId: string }) {
    const drive = await this.googleDriveClientService.getClient(userId);

    await drive.drives.delete({
      driveId: input.driveId,
    });

    return { driveId: input.driveId };
  }
}
