import { Test, TestingModule } from '@nestjs/testing';
import { LogoutService } from './logout.service.js';
import { SessionService } from './session.service.js';

describe('LogoutService', () => {
  let service: LogoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutService,
        { provide: SessionService, useValue: {} },
      ],
    }).compile();

    service = module.get<LogoutService>(LogoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
