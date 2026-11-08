import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GoogleDriveClientService } from './google-drive-client.service.js';

@Injectable()
export class GoogleDriveService {
    constructor(
        private readonly googleDriveClientService: GoogleDriveClientService,
    ) { }

    async listFiles(userId: string, pageToken?: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.files.list({
            pageSize: 10,
            pageToken,
            q: 'trashed = false',
            orderBy: 'modifiedTime desc',
            fields: 'nextPageToken, files(id, name, mimeType, webViewLink)',
        });

        return {
            files: response.data.files ?? [],
            nextPageToken: response.data.nextPageToken ?? null,
        };
    }

    // Search files by name or full-text content in Google Drive.
    async searchFiles(userId: string, query: string, pageToken?: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        // Escape special characters used in Google Drive query syntax.
        const escapedQuery = query.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        const response = await drive.files.list({
            pageSize: 10,
            pageToken,
            q: `trashed = false and (name contains '${escapedQuery}' or fullText contains '${escapedQuery}')`,
            orderBy: 'modifiedTime desc',
            fields: 'nextPageToken, files(id, name, mimeType, webViewLink)',
        });

        return {
            files: response.data.files ?? [],
            nextPageToken: response.data.nextPageToken ?? null,
        };
    }

    // Get file details from Google Drive.
    async getFile(userId: string, fileId: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.files.get({
            fileId,
            fields: 'id, name, mimeType, description, size, webViewLink, createdTime, modifiedTime, parents, trashed',
        });

        return response.data;
    }

    // Create a file in the authenticated user's Google Drive.
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
            media: input.content === undefined
                ? undefined
                : {
                    mimeType: input.mimeType ?? 'text/plain',
                    body: input.content,
                },
            fields: 'id, name, mimeType, size, webViewLink, createdTime, modifiedTime, parents',
        });

        return response.data;
    }

    // Update file metadata and, when provided, its text content.
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
            media: input.content === undefined
                ? undefined
                : {
                    mimeType: input.mimeType ?? 'text/plain',
                    body: input.content,
                },
            fields: 'id, name, mimeType, description, size, webViewLink, createdTime, modifiedTime, parents',
        });

        return response.data;
    }

    // Move a file by replacing its existing parent folder.
    async moveFile(userId: string, fileId: string, parentId: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        // Read current parents so the file can be detached from its old folder.
        const currentFile = await drive.files.get({
            fileId,
            fields: 'id, parents',
        });
        const currentParents = currentFile.data.parents ?? [];

        const response = await drive.files.update({
            fileId,
            addParents: parentId,
            removeParents: currentParents.length > 0
                ? currentParents.join(',')
                : undefined,
            fields: 'id, name, mimeType, webViewLink, parents, modifiedTime',
        });

        return response.data;
    }

    // Rename a file without changing its other metadata or content.
    async renameFile(userId: string, fileId: string, newName: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.files.update({
            fileId,
            requestBody: {
                name: newName,
            },
            fields: 'id, name, mimeType, webViewLink, modifiedTime, parents',
        });

        return response.data;
    }

    // Move a file to the Google Drive trash without permanently deleting it.
    async trashFile(userId: string, fileId: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.files.update({
            fileId,
            requestBody: {
                trashed: true,
            },
            fields: 'id, name, mimeType, trashed, modifiedTime',
        });

        return response.data;
    }

    // Restore a previously trashed file.
    async untrashFile(userId: string, fileId: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.files.update({
            fileId,
            requestBody: {
                trashed: false,
            },
            fields: 'id, name, mimeType, trashed, modifiedTime, parents',
        });

        return response.data;
    }

    // Create a copy of a file, optionally assigning a new name or parent folder.
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
            fields: 'id, name, mimeType, size, webViewLink, createdTime, modifiedTime, parents',
        });

        return response.data;
    }

    // Permanently delete a file; this operation cannot be undone.
    async deleteFile(userId: string, fileId: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        await drive.files.delete({ fileId });
    }

    // Download a binary Drive file and encode it for an MCP text response.
    async downloadFile(userId: string, fileId: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        // Fetch metadata first to identify the file and its MIME type.
        const metadata = await drive.files.get({
            fileId,
            fields: 'id, name, mimeType, size',
        });

        // Google Workspace-native files must be exported instead.
        if (metadata.data.mimeType?.startsWith('application/vnd.google-apps.')) {
            throw new Error('Google Workspace files must be retrieved with export_file.');
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

    // Export a Google Workspace file to a requested MIME type.
    async exportFile(userId: string, fileId: string, mimeType: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const metadata = await drive.files.get({
            fileId,
            fields: 'id, name, mimeType',
        });

        if (!metadata.data.mimeType?.startsWith('application/vnd.google-apps.')) {
            throw new Error('export_file is only for Google Workspace-native files. Use download_file instead.');
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

    // List folders while excluding trashed items.
    async listFolders(userId: string, pageToken?: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.files.list({
            pageSize: 100,
            pageToken,
            q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            orderBy: 'name',
            fields: 'nextPageToken, files(id, name, mimeType, webViewLink, parents, createdTime, modifiedTime)',
        });

        return {
            folders: response.data.files ?? [],
            nextPageToken: response.data.nextPageToken ?? null,
        };
    }

    // Create a Google Drive folder, optionally inside another folder.
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
            fields: 'id, name, mimeType, webViewLink, parents, createdTime, modifiedTime',
        });

        return response.data;
    }

    // Rename a Google Drive folder without changing its contents.
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

    // Move a Google Drive folder to another parent folder.
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
            removeParents: currentParents.length > 0
                ? currentParents.join(',')
                : undefined,
            fields: 'id, name, mimeType, webViewLink, parents, modifiedTime',
        });

        return response.data;
    }

    // Move a Google Drive folder to trash without permanently deleting it.
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

    // Restore a trashed Google Drive folder.
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

    // Create a permission for a Drive file or folder.
    async createPermission(userId: string, input: {
        fileId: string;
        type: 'user' | 'group' | 'domain' | 'anyone';
        role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
        emailAddress?: string;
        domain?: string;
        sendNotificationEmail?: boolean;
        emailMessage?: string;
        expirationTime?: string;
        allowFileDiscovery?: boolean;
    }) {
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
            fields: 'id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted',
        });

        return response.data;
    }

    // Get one permission by its ID.
    async getPermission(userId: string, input: {
        fileId: string;
        permissionId: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.permissions.get({
            fileId: input.fileId,
            permissionId: input.permissionId,
            fields: 'id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted',
        });

        return response.data;
    }

    // List permissions on a Drive file or folder.
    async listPermissions(userId: string, input: {
        fileId: string;
        pageToken?: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.permissions.list({
            fileId: input.fileId,
            pageSize: 100,
            pageToken: input.pageToken,
            fields: 'nextPageToken, permissions(id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted)',
        });

        return {
            permissions: response.data.permissions ?? [],
            nextPageToken: response.data.nextPageToken ?? null,
        };
    }

    // Update the role or expiration time of an existing permission.
    async updatePermission(userId: string, input: {
        fileId: string;
        permissionId: string;
        role: 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
        expirationTime?: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.permissions.update({
            fileId: input.fileId,
            permissionId: input.permissionId,
            requestBody: {
                role: input.role,
                expirationTime: input.expirationTime,
            },
            fields: 'id, type, role, emailAddress, domain, displayName, expirationTime, allowFileDiscovery, deleted',
        });

        return response.data;
    }

    // Remove a permission from a Drive file or folder.
    async deletePermission(userId: string, input: {
        fileId: string;
        permissionId: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        await drive.permissions.delete({
            fileId: input.fileId,
            permissionId: input.permissionId,
        });

        return { fileId: input.fileId, permissionId: input.permissionId };
    }

    // Create a comment on a Drive file.
    async createComment(userId: string, input: {
        fileId: string;
        content: string;
        quotedFileContent?: { mimeType: string; value: string };
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.comments.create({
            fileId: input.fileId,
            requestBody: {
                content: input.content,
                quotedFileContent: input.quotedFileContent,
            },
            fields: 'id, content, author, createdTime, modifiedTime, quotedFileContent, resolved, replies',
        });

        return response.data;
    }

    // Get a comment by its ID.
    async getComment(userId: string, input: {
        fileId: string;
        commentId: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.comments.get({
            fileId: input.fileId,
            commentId: input.commentId,
            fields: 'id, content, author, createdTime, modifiedTime, quotedFileContent, resolved, deleted, replies',
        });

        return response.data;
    }

    // List comments on a Drive file.
    async listComments(userId: string, input: {
        fileId: string;
        pageToken?: string;
        includeDeleted?: boolean;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.comments.list({
            fileId: input.fileId,
            pageSize: 100,
            pageToken: input.pageToken,
            includeDeleted: input.includeDeleted,
            fields: 'nextPageToken, comments(id, content, author, createdTime, modifiedTime, quotedFileContent, resolved, deleted, replies)',
        });

        return {
            comments: response.data.comments ?? [],
            nextPageToken: response.data.nextPageToken ?? null,
        };
    }

    // Update a comment's content or resolved state.
    async updateComment(userId: string, input: {
        fileId: string;
        commentId: string;
        content?: string;
        resolved?: boolean;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.comments.update({
            fileId: input.fileId,
            commentId: input.commentId,
            requestBody: {
                content: input.content,
                resolved: input.resolved,
            },
            fields: 'id, content, author, createdTime, modifiedTime, resolved, deleted, replies',
        });

        return response.data;
    }

    // Delete a comment from a Drive file.
    async deleteComment(userId: string, input: {
        fileId: string;
        commentId: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        await drive.comments.delete({
            fileId: input.fileId,
            commentId: input.commentId,
        });

        return { fileId: input.fileId, commentId: input.commentId };
    }

    // List revisions of a Drive file.
    async listRevisions(userId: string, input: {
        fileId: string;
        pageToken?: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.revisions.list({
            fileId: input.fileId,
            pageSize: 100,
            pageToken: input.pageToken,
            fields: 'nextPageToken, revisions(id, mimeType, modifiedTime, keepForever, published, size, exportLinks, lastModifyingUser)',
        });

        return {
            revisions: response.data.revisions ?? [],
            nextPageToken: response.data.nextPageToken ?? null,
        };
    }

    // Get metadata for a specific file revision.
    async getRevision(userId: string, input: {
        fileId: string;
        revisionId: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.revisions.get({
            fileId: input.fileId,
            revisionId: input.revisionId,
            fields: 'id, mimeType, modifiedTime, keepForever, published, size, exportLinks, lastModifyingUser',
        });

        return response.data;
    }

    // Create a shared drive with a unique request ID.
    async createSharedDrive(userId: string, input: {
        name: string;
        requestId?: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.drives.create({
            requestId: input.requestId ?? randomUUID(),
            requestBody: { name: input.name },
            fields: 'id, name, colorRgb, createdTime, hidden',
        });

        return response.data;
    }

    // List shared drives available to the authenticated user.
    async listSharedDrives(userId: string, input: {
        pageToken?: string;
        pageSize?: number;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.drives.list({
            pageSize: input.pageSize ?? 100,
            pageToken: input.pageToken,
            fields: 'nextPageToken, drives(id, name, colorRgb, createdTime, hidden)',
        });

        return {
            drives: response.data.drives ?? [],
            nextPageToken: response.data.nextPageToken ?? null,
        };
    }

    // Get metadata for a shared drive.
    async getSharedDrive(userId: string, input: { driveId: string }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.drives.get({
            driveId: input.driveId,
            fields: 'id, name, colorRgb, createdTime, hidden, restrictions, capabilities',
        });

        return response.data;
    }

    // Update a shared drive's name.
    async updateSharedDrive(userId: string, input: {
        driveId: string;
        name: string;
    }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.drives.update({
            driveId: input.driveId,
            requestBody: { name: input.name },
            fields: 'id, name, colorRgb, createdTime, hidden, restrictions',
        });

        return response.data;
    }

    // Delete a shared drive.
    async deleteSharedDrive(userId: string, input: { driveId: string }) {
        const drive = await this.googleDriveClientService.getClient(userId);

        await drive.drives.delete({
            driveId: input.driveId,
        });

        return { driveId: input.driveId };
    }
}