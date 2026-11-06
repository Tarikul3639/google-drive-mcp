import { Test, TestingModule } from '@nestjs/testing';
import { OauthStateService } from './oauth-state.service.js';

describe('OauthStateService', () => {
  let service: OauthStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthStateService],
    }).compile();

    service = module.get<OauthStateService>(OauthStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
