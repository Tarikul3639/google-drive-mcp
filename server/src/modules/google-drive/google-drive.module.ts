import { Module } from '@nestjs/common';
import { GoogleDriveService } from './services/google-drive.service.js';
import { GoogleDriveClientService } from './services/google-drive-client.service.js';

import { GoogleIntegrationService } from '../google-integration/services/google-integration.service.js';
import { GoogleTokenService } from '../google-integration/services/google-token.service.js';

@Module({
  imports: [],
  providers: [
    //Google Integration Services
    GoogleTokenService,
    GoogleIntegrationService,

    //Google Drive Services
    GoogleDriveService,
    GoogleDriveClientService,
  ],
  exports: [
    GoogleDriveService,
    GoogleDriveClientService,
  ],
})
export class GoogleDriveModule { }
