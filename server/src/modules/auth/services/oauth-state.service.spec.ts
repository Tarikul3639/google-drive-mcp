import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../../../redis/redis.service.js';
import { OAuthStateService } from './oauth-state.service.js';

describe('OAuthStateService', () => {
  let service: OAuthStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OAuthStateService, { provide: RedisService, useValue: {} }],
    }).compile();

    service = module.get<OAuthStateService>(OAuthStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
