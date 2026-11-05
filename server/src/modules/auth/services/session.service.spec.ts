import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RedisService } from '../../../redis/redis.service.js';
import { SessionService } from './session.service.js';

describe('SessionService', () => {
  let service: SessionService;

  const redisMock = {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: RedisService,
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a session', async () => {
    redisMock.set.mockResolvedValue(undefined);

    const sessionId = await service.create('user-123');

    expect(sessionId).toHaveLength(64);
    expect(redisMock.set).toHaveBeenCalledWith(
      `session:${sessionId}`,
      expect.any(String),
      604800,
    );
  });

  it('should find a session', async () => {
    const session = {
      userId: 'user-123',
      createdAt: new Date().toISOString(),
    };

    redisMock.get.mockResolvedValue(JSON.stringify(session));

    const result = await service.findById('session-123');

    expect(result).toEqual(session);
  });

  it('should return null if session does not exist', async () => {
    redisMock.get.mockResolvedValue(null);

    const result = await service.findById('session-123');

    expect(result).toBeNull();
  });

  it('should validate a session', async () => {
    const session = {
      userId: 'user-123',
      createdAt: new Date().toISOString(),
    };

    redisMock.get.mockResolvedValue(JSON.stringify(session));

    const result = await service.validate('session-123');

    expect(result).toEqual(session);
  });

  it('should destroy a session', async () => {
    redisMock.del.mockResolvedValue(undefined);

    await service.destroy('session-123');

    expect(redisMock.del).toHaveBeenCalledWith('session:session-123');
  });

  it('should refresh a session', async () => {
    const session = {
      userId: 'user-123',
      createdAt: new Date().toISOString(),
    };

    redisMock.get.mockResolvedValue(JSON.stringify(session));
    redisMock.set.mockResolvedValue(undefined);

    const result = await service.refresh('session-123');

    expect(result).toBe(true);
    expect(redisMock.set).toHaveBeenCalledWith(
      'session:session-123',
      JSON.stringify(session),
      604800,
    );
  });

  it('should return false when refreshing a missing session', async () => {
    redisMock.get.mockResolvedValue(null);

    const result = await service.refresh('session-123');

    expect(result).toBe(false);
    expect(redisMock.set).not.toHaveBeenCalled();
  });
});
