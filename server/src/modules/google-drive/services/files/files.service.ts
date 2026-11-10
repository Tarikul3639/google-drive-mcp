import { Injectable, BadRequestException } from '@nestjs/common';
import { Readable } from 'node:stream';
import { GoogleDriveClientService } from '../google-drive-client.service.js';
import {
  driveFileFields,
  driveFileListFields,
} from '../google-drive-fields.js';

// Provides Google Drive file listing, search, metadata, content, and lifecycle operations.
@Injectable()
export class FilesService {
  private readonly maxUploadBytes = 1000 * 1024 * 1024;

  constructor(
    private readonly googleDriveClientService: GoogleDriveClientService,
  ) {}

  // Lists files.
  async listFiles(userId: string, pageToken?: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.list({
      pageSize: 50,
      pageToken,
      q: 'trashed = false',
      orderBy: 'modifiedTime desc',
      fields: `${driveFileListFields('nextPageToken')}, files(${driveFileFields('id', 'name', 'mimeType', 'webViewLink')})`,
    });

    return {
      files: response.data.files ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
    };
  }

  // Handles the search files operation.
  async searchFiles(userId: string, query: string, pageToken?: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Escape special characters used in Google Drive query syntax.
    const escapedQuery = query.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    const response = await drive.files.list({
      pageSize: 10,
      pageToken,
      q: `trashed = false and (name contains '${escapedQuery}' or fullText contains '${escapedQuery}')`,
      orderBy: 'modifiedTime desc',
      fields: `${driveFileListFields('nextPageToken')}, files(${driveFileFields('id', 'name', 'mimeType', 'webViewLink')})`,
    });

    return {
      files: response.data.files ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
    };
  }

  // Retrieves file.
  async getFile(userId: string, fileId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.get({
      fileId,
      fields: driveFileFields(
        'id',
        'name',
        'mimeType',
        'description',
        'size',
        'webViewLink',
        'createdTime',
        'modifiedTime',
        'parents',
        'trashed',
      ),
    });

    return response.data;
  }

  // Creates file.
  async createFile(
    userId: string,
    input: {
      name: string;
      mimeType?: string;
      content?: string;
      parentId?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.create({
      requestBody: {
        name: input.name,
        mimeType: input.mimeType,
        parents: input.parentId ? [input.parentId] : undefined,
      },
      media:
        input.content === undefined
          ? undefined
          : {
              mimeType: input.mimeType ?? 'text/plain',
              body: input.content,
            },
      fields: driveFileFields(
        'id',
        'name',
        'mimeType',
        'size',
        'webViewLink',
        'createdTime',
        'modifiedTime',
        'parents',
      ),
    });

    return response.data;
  }

  // Updates file.
  async updateFile(
    userId: string,
    input: {
      fileId: string;
      name?: string;
      description?: string;
      mimeType?: string;
      content?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.update({
      fileId: input.fileId,
      requestBody: {
        name: input.name,
        description: input.description,
      },
      // Upload media only when content was explicitly provided.
      media:
        input.content === undefined
          ? undefined
          : {
              mimeType: input.mimeType ?? 'text/plain',
              body: input.content,
            },
      fields:
        'id, name, mimeType, description, size, webViewLink, createdTime, modifiedTime, parents',
    });

    return response.data;
  }

  // Moves file.
  async moveFile(userId: string, fileId: string, parentId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Read current parents so the file can be detached from its old folder.
    const currentFile = await drive.files.get({
      fileId,
      fields: driveFileFields('id', 'parents'),
    });
    const currentParents = currentFile.data.parents ?? [];

    const response = await drive.files.update({
      fileId,
      addParents: parentId,
      removeParents:
        currentParents.length > 0 ? currentParents.join(',') : undefined,
      fields: driveFileFields(
        'id',
        'name',
        'mimeType',
        'webViewLink',
        'parents',
        'modifiedTime',
      ),
    });

    return response.data;
  }

  // Renames file.
  async renameFile(userId: string, fileId: string, newName: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.update({
      fileId,
      requestBody: {
        name: newName,
      },
      fields: driveFileFields(
        'id',
        'name',
        'mimeType',
        'webViewLink',
        'modifiedTime',
        'parents',
      ),
    });

    return response.data;
  }

  // Moves the file to the trash.
  async trashFile(userId: string, fileId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.update({
      fileId,
      requestBody: {
        trashed: true,
      },
      fields: driveFileFields(
        'id',
        'name',
        'mimeType',
        'trashed',
        'modifiedTime',
      ),
    });

    return response.data;
  }

  // Restores the file from the trash.
  async untrashFile(userId: string, fileId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.update({
      fileId,
      requestBody: {
        trashed: false,
      },
      fields: driveFileFields(
        'id',
        'name',
        'mimeType',
        'trashed',
        'modifiedTime',
        'parents',
      ),
    });

    return response.data;
  }

  // Copies file.
  async copyFile(
    userId: string,
    input: {
      fileId: string;
      name?: string;
      parentId?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.files.copy({
      fileId: input.fileId,
      requestBody: {
        name: input.name,
        parents: input.parentId ? [input.parentId] : undefined,
      },
      fields: driveFileFields(
        'id',
        'name',
        'mimeType',
        'size',
        'webViewLink',
        'createdTime',
        'modifiedTime',
        'parents',
      ),
    });

    return response.data;
  }

  // Deletes file.
  async deleteFile(userId: string, fileId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    await drive.files.delete({ fileId });
  }

  // Downloads file.
  async downloadFile(userId: string, fileId: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Fetch metadata first to identify the file and its MIME type.
    const metadata = await drive.files.get({
      fileId,
      fields: driveFileFields('id', 'name', 'mimeType', 'size'),
    });

    // Google Workspace-native files must be exported instead.
    if (metadata.data.mimeType?.startsWith('application/vnd.google-apps.')) {
      throw new Error(
        'Google Workspace files must be retrieved with export_file.',
      );
    }

    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' },
    );

    return {
      fileId,
      name: metadata.data.name,
      mimeType: response.headers['content-type'] ?? metadata.data.mimeType,
      dataBase64: Buffer.from(response.data as ArrayBuffer).toString('base64'),
    };
  }

  // Exports file.
  async exportFile(userId: string, fileId: string, mimeType: string) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const metadata = await drive.files.get({
      fileId,
      fields: driveFileFields('id', 'name', 'mimeType'),
    });

    if (!metadata.data.mimeType?.startsWith('application/vnd.google-apps.')) {
      throw new Error(
        'export_file is only for Google Workspace-native files. Use download_file instead.',
      );
    }

    const response = await drive.files.export(
      { fileId, mimeType },
      { responseType: 'arraybuffer' },
    );

    return {
      fileId,
      name: metadata.data.name,
      mimeType,
      dataBase64: Buffer.from(response.data as ArrayBuffer).toString('base64'),
    };
  }

  // Uploads file.
  async uploadFile(
    userId: string,
    input: {
      name: string;
      mimeType: string;
      dataBase64: string;
      parentId?: string;
    },
  ) {
    const data = Buffer.from(input.dataBase64, 'base64');

    if (data.length === 0) {
      throw new BadRequestException('The uploaded file is empty or invalid.');
    }
    if (data.length > this.maxUploadBytes) {
      throw new BadRequestException('Maximum upload size is 1000 MB.');
    }

    const drive = await this.googleDriveClientService.getClient(userId);
    const response = await drive.files.create({
      requestBody: {
        name: input.name,
        mimeType: input.mimeType,
        parents: input.parentId ? [input.parentId] : undefined,
      },
      media: {
        mimeType: input.mimeType,
        body: Readable.from(data),
      },
      fields: 'id, name, mimeType, size, webViewLink, createdTime, parents',
    });

    return response.data;
  }
}
