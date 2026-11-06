import { Test, TestingModule } from '@nestjs/testing';
import { GoogleTokenService } from './google-token.service.js';
import { ConfigService } from '../../../config/config.service.js';

describe('GoogleTokenService', () => {
  let service: GoogleTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleTokenService,
        {
          provide: ConfigService,
          useValue: { googleTokenEncryptionKey: '0'.repeat(64) },
        },
      ],
    }).compile();

    service = module.get<GoogleTokenService>(GoogleTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
