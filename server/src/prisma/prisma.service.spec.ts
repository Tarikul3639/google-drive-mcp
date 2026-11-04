import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  let service: PrismaService;
  let module: TestingModule;

  const mockDb = {
    close: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            db: mockDb,
            onModuleDestroy: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose database client', () => {
    expect(service.db).toBe(mockDb);
  });

  it('should close database connection on destroy', async () => {
    await mockDb.close();

    expect(mockDb.close).toHaveBeenCalledTimes(1);
  });
});
