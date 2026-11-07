import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../config/config.service.js';
import { RefreshService } from './refresh.service.js';
import { SessionService } from './session.service.js';

describe('RefreshService', () => {
  let service: RefreshService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshService,
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: SessionService, useValue: {} },
      ],
    }).compile();

    service = module.get<RefreshService>(RefreshService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
