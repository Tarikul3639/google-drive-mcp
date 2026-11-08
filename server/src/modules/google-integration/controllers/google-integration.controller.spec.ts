import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { GoogleIntegrationController } from './google-integration.controller.js';
import { GoogleIntegrationService } from '../services/google-integration.service.js';
import { ConfigService } from '../../../config/config.service.js';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard.js';
import { GoogleDriveGuard } from '../guards/google-drive.guard.js';
import { OAuthStateService } from '../../auth/services/oauth-state.service.js';
import { UsersService } from '../../users/users.service.js';

describe('GoogleIntegrationController', () => {
  let controller: GoogleIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleIntegrationController],
      providers: [
        { provide: GoogleIntegrationService, useValue: {} },
        { provide: ConfigService, useValue: { frontendUrl: 'http://localhost:3000' } },
        { provide: OAuthStateService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: AccessTokenGuard, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: GoogleDriveGuard, useValue: {} },
      ],
    }).compile();

    controller = module.get<GoogleIntegrationController>(GoogleIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
