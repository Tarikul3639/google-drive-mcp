import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service.js';
import { DatabaseIndicator } from './indicators/database.indicator.js';
import { RedisIndicator } from './indicators/redis.indicator.js';
import { MemoryIndicator } from './indicators/memory.indicator.js';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: DatabaseIndicator, useValue: {} },
        { provide: RedisIndicator, useValue: {} },
        { provide: MemoryIndicator, useValue: {} },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
