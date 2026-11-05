import { Test, TestingModule } from '@nestjs/testing';
import { RefreshService } from './refresh.service.js';
import { TokenService } from './token.service.js';
import { SessionService } from './session.service.js';

describe('RefreshService', () => {
  let service: RefreshService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshService,
        { provide: TokenService, useValue: {} },
        { provide: SessionService, useValue: {} },
      ],
    }).compile();

    service = module.get<RefreshService>(RefreshService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
