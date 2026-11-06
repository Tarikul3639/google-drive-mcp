import { Test, TestingModule } from '@nestjs/testing';
import { GoogleIntegrationService } from './google-integration.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { GoogleTokenService } from './google-token.service.js';

describe('GoogleIntegrationService', () => {
  let service: GoogleIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleIntegrationService,
        { provide: PrismaService, useValue: {} },
        { provide: GoogleTokenService, useValue: {} },
      ],
    }).compile();

    service = module.get<GoogleIntegrationService>(GoogleIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
