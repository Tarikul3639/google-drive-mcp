import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service.js';
import { ConfigService } from '../config/config.service.js';
import { createClient } from 'redis';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('redis', () => ({
  createClient: vi.fn(),
}));

describe('RedisService', () => {
  let service: RedisService;

  const mockRedisClient = {
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    quit: vi.fn().mockResolvedValue('OK'),
    set: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    del: vi.fn().mockResolvedValue(1),
    exists: vi.fn().mockResolvedValue(1),
    isOpen: true,
  };

  const mockConfigService = {
    redisUrl: 'redis://localhost:6379',
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    vi.mocked(createClient).mockReturnValue(mockRedisClient as never);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to Redis on module initialization', async () => {
    await service.onModuleInit();

    expect(createClient).toHaveBeenCalledWith({
      url: mockConfigService.redisUrl,
    });

    expect(mockRedisClient.connect).toHaveBeenCalled();
  });

  it('should disconnect from Redis on module destruction', async () => {
    await service.onModuleInit();
    await service.onModuleDestroy();

    expect(mockRedisClient.quit).toHaveBeenCalled();
  });

  it('should set a value in Redis', async () => {
    await service.onModuleInit();

    await service.set('user:123', 'John');

    expect(mockRedisClient.set).toHaveBeenCalledWith('user:123', 'John');
  });

  it('should set a value with expiration', async () => {
    await service.onModuleInit();

    await service.set('user:123', 'John', 300);

    expect(mockRedisClient.set).toHaveBeenCalledWith('user:123', 'John', {
      EX: 300,
    });
  });

  it('should get a value from Redis', async () => {
    await service.onModuleInit();

    mockRedisClient.get.mockResolvedValueOnce('John');

    const result = await service.get('user:123');

    expect(result).toBe('John');
  });

  it('should delete a value from Redis', async () => {
    await service.onModuleInit();

    await service.del('user:123');

    expect(mockRedisClient.del).toHaveBeenCalledWith('user:123');
  });

  it('should check if a key exists', async () => {
    await service.onModuleInit();

    const result = await service.exists('user:123');

    expect(result).toBe(true);
  });
});
