import { Injectable } from '@nestjs/common';
import { GoogleDriveClientService } from '../google-drive-client.service.js';

// Provides Google Drive folder listing, creation, organization, and lifecycle operations.
@Injectable()
export class FoldersService {
  constructor(
    private readonly googleDriveClientService: GoogleDriveClientService,
  ) {}

  // Lists folders.
  async listFolders(userId: string, pageToken?: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.list({
      pageSize: 100,
      pageToken,
      q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
      orderBy: 'name',
      fields:
        'nextPageToken, files(id, name, mimeType, webViewLink, parents, createdTime, modifiedTime)',
    });

    return {
      folders: response.data.files ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
    };
  }

  // Creates folder.
  async createFolder(
    userId: string,
    input: {
      name: string;
      parentId?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.create({
      requestBody: {
        name: input.name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: input.parentId ? [input.parentId] : undefined,
      },
      fields:
        'id, name, mimeType, webViewLink, parents, createdTime, modifiedTime',
    });

    return response.data;
  }

  // Renames folder.
  async renameFolder(userId: string, folderId: string, newName: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Confirm the target is a folder before renaming it.
    const metadata = await drive.files.get({
      fileId: folderId,
      fields: 'id, mimeType',
    });
    if (metadata.data.mimeType !== 'application/vnd.google-apps.folder') {
      throw new Error('The specified item is not a folder.');
    }

    const response = await drive.files.update({
      fileId: folderId,
      requestBody: { name: newName },
      fields: 'id, name, mimeType, webViewLink, parents, modifiedTime',
    });

    return response.data;
  }

  // Moves folder.
  async moveFolder(userId: string, folderId: string, parentId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Confirm the source is a folder before changing its parent.
    const metadata = await drive.files.get({
      fileId: folderId,
      fields: 'id, mimeType, parents',
    });
    if (metadata.data.mimeType !== 'application/vnd.google-apps.folder') {
      throw new Error('The specified item is not a folder.');
    }

    const currentParents = metadata.data.parents ?? [];
    const response = await drive.files.update({
      fileId: folderId,
      addParents: parentId,
      removeParents:
        currentParents.length > 0 ? currentParents.join(',') : undefined,
      fields: 'id, name, mimeType, webViewLink, parents, modifiedTime',
    });

    return response.data;
  }

  // Moves the folder to the trash.
  async trashFolder(userId: string, folderId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Confirm the target is a folder before moving it to trash.
    const metadata = await drive.files.get({
      fileId: folderId,
      fields: 'id, mimeType',
    });
    if (metadata.data.mimeType !== 'application/vnd.google-apps.folder') {
      throw new Error('The specified item is not a folder.');
    }

    const response = await drive.files.update({
      fileId: folderId,
      requestBody: { trashed: true },
      fields: 'id, name, mimeType, trashed, modifiedTime, parents',
    });

    return response.data;
  }

  // Restores the folder from the trash.
  async untrashFolder(userId: string, folderId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Confirm the target is a folder before restoring it.
    const metadata = await drive.files.get({
      fileId: folderId,
      fields: 'id, mimeType',
    });
    if (metadata.data.mimeType !== 'application/vnd.google-apps.folder') {
      throw new Error('The specified item is not a folder.');
    }

    const response = await drive.files.update({
      fileId: folderId,
      requestBody: { trashed: false },
      fields: 'id, name, mimeType, trashed, modifiedTime, parents',
    });

    return response.data;
  }
}
