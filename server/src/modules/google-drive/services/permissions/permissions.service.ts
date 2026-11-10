import { Injectable } from '@nestjs/common';
import { GoogleDriveClientService } from '../drive/google-drive-client.service.js';

// Manages access permissions for Google Drive files and folders.
@Injectable()
export class PermissionsService {
  constructor(
    private readonly googleDriveClientService: GoogleDriveClientService,
  ) {}

  // Creates an access permission for a Drive resource.
  async createPermission(
    userId: string,
    input: {
      fileId: string;
      type: 'user' | 'group' | 'domain' | 'anyone';
      role:
        | 'owner'
        | 'organizer'
        | 'fileOrganizer'
        | 'writer'
        | 'commenter'
        | 'reader';
      emailAddress?: string;
      domain?: string;
      sendNotificationEmail?: boolean;
      emailMessage?: string;
      expirationTime?: string;
      allowFileDiscovery?: boolean;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    // Include optional fields only when supplied by the caller.
    const response = await drive.permissions.create({
      fileId: input.fileId,
      requestBody: {
        type: input.type,
        role: input.role,
        emailAddress: input.emailAddress,
        domain: input.domain,
        expirationTime: input.expirationTime,
        allowFileDiscovery: input.allowFileDiscovery,
      },
      sendNotificationEmail: input.sendNotificationEmail,
      emailMessage: input.emailMessage,
      fields:
        'id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted',
    });

    return response.data;
  }

  // Retrieves a permission by its ID.
  async getPermission(
    userId: string,
    input: {
      fileId: string;
      permissionId: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.permissions.get({
      fileId: input.fileId,
      permissionId: input.permissionId,
      fields:
        'id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted',
    });

    return response.data;
  }

  // Lists permissions assigned to a Drive resource.
  async listPermissions(
    userId: string,
    input: {
      fileId: string;
      pageToken?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.permissions.list({
      fileId: input.fileId,
      pageSize: 100,
      pageToken: input.pageToken,
      fields:
        'nextPageToken, permissions(id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted)',
    });

    return {
      permissions: response.data.permissions ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
    };
  }

  // Updates an existing Drive permission.
  async updatePermission(
    userId: string,
    input: {
      fileId: string;
      permissionId: string;
      role: 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
      expirationTime?: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    const response = await drive.permissions.update({
      fileId: input.fileId,
      permissionId: input.permissionId,
      requestBody: {
        role: input.role,
        expirationTime: input.expirationTime,
      },
      fields:
        'id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted',
    });

    return response.data;
  }

  // Deletes an access permission.
  async deletePermission(
    userId: string,
    input: {
      fileId: string;
      permissionId: string;
    },
  ) {
    const drive = await this.googleDriveClientService.getClient(userId);

    await drive.permissions.delete({
      fileId: input.fileId,
      permissionId: input.permissionId,
    });

    return { fileId: input.fileId, permissionId: input.permissionId };
  }
}
