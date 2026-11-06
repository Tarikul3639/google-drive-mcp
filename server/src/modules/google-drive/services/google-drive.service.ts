import { Injectable } from '@nestjs/common';
import { GoogleDriveClientService } from './google-drive-client.service.js';

@Injectable()
export class GoogleDriveService {
    constructor(
        private readonly googleDriveClientService: GoogleDriveClientService,
    ) { }

    async listFiles(userId: string) {
        const drive = await this.googleDriveClientService.getClient(userId);

        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, mimeType, webViewLink)',
        });

        return response.data.files ?? [];
    }
}
