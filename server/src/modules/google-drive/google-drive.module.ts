import { Module } from '@nestjs/common';
import { GoogleDriveClientService } from './services/google-drive-client.service.js';
import { FilesService } from './services/files/files.service.js';
import { FoldersService } from './services/folders/folders.service.js';
import { PermissionsService } from './services/permissions/permissions.service.js';
import { CommentsService } from './services/comments/comments.service.js';
import { RevisionsService } from './services/revisions/revisions.service.js';
import { SharedDrivesService } from './services/shared-drives/shared-drives.service.js';
import { GoogleWorkspaceService } from './services/google-workspace/google-workspace.service.js';
import { OfficeFileService } from './services/office-document-processing/office-file.service.js';

import { GoogleIntegrationService } from '../google-integration/services/google-integration.service.js';
import { GoogleTokenService } from '../google-integration/services/google-token.service.js';

// Register the shared Google API client and category-specific feature services.
@Module({
  imports: [],
  providers: [
    GoogleTokenService,
    GoogleIntegrationService,
    GoogleDriveClientService,
    FilesService,
    FoldersService,
    PermissionsService,
    CommentsService,
    RevisionsService,
    SharedDrivesService,
    GoogleWorkspaceService,
    OfficeFileService,
  ],
  exports: [
    GoogleDriveClientService,
    FilesService,
    FoldersService,
    PermissionsService,
    CommentsService,
    RevisionsService,
    SharedDrivesService,
    GoogleWorkspaceService,
    OfficeFileService,
  ],
})
export class GoogleDriveModule {}
