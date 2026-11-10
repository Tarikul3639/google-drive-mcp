import { Injectable } from '@nestjs/common';

import { DatabaseIndicator } from './indicators/database.indicator.js';
import { RedisIndicator } from './indicators/redis.indicator.js';
import { MemoryIndicator } from './indicators/memory.indicator.js';

@Injectable()
export class HealthService {
  constructor(
    private readonly databaseIndicator: DatabaseIndicator,
    private readonly redisIndicator: RedisIndicator,
    private readonly memoryIndicator: MemoryIndicator,
  ) {}

  checkLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase() {
    return this.createHealthResponse(
      'database',
      this.databaseIndicator.check(),
    );
  }

  async checkRedis() {
    return this.createHealthResponse('redis', this.redisIndicator.check());
  }

  checkMemory() {
    return this.createHealthResponse(
      'memory',
      Promise.resolve(this.memoryIndicator.check()),
    );
  }

  private async createHealthResponse(service: string, check: Promise<unknown>) {
    try {
      const details = await check;

      return {
        status: 'ok',
        service,
        details,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'error',
        service,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
