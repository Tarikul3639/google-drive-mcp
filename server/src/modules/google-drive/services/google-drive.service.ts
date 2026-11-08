import { Injectable } from '@nestjs/common';
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
}