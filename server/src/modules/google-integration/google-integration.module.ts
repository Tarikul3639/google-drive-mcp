import { Module } from '@nestjs/common';
import { GoogleIntegrationController } from './controllers/google-integration.controller.js';
import { GoogleIntegrationService } from './services/google-integration.service.js';
import { GoogleTokenService } from './services/google-token.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';

import { GoogleDriveGuard } from './guards/google-drive.guard.js';
import { GoogleDriveStrategy } from './strategies/google-drive.strategy.js';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [
        GoogleIntegrationController,
    ],
    providers: [
        GoogleIntegrationService,
        GoogleTokenService,
        GoogleDriveGuard,
        GoogleDriveStrategy,
    ],
    exports: [
        GoogleIntegrationService,
        GoogleTokenService,
    ],
})
export class GoogleIntegrationModule {}
