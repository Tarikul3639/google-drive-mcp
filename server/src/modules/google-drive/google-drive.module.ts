import { Module } from '@nestjs/common';
import { GoogleDriveService } from './services/google-drive.service.js';
import { GoogleDriveClientService } from './services/google-drive-client.service.js';
import { GoogleWorkspaceService } from './services/google-workspace.service.js';
import { OfficeFileService } from './services/office-file.service.js';

import { GoogleIntegrationService } from '../google-integration/services/google-integration.service.js';
import { GoogleTokenService } from '../google-integration/services/google-token.service.js';

// Register the shared Google API client and the Workspace/Office feature services.
@Module({
  imports: [],
  providers: [
    GoogleTokenService,
    GoogleIntegrationService,
    GoogleDriveService,
    GoogleDriveClientService,
    GoogleWorkspaceService,
    OfficeFileService,
  ],
  exports: [
    GoogleDriveService,
    GoogleDriveClientService,
    GoogleWorkspaceService,
    OfficeFileService,
  ],
})
export class GoogleDriveModule {}
