import { Injectable } from '@nestjs/common';

import { RedisService } from '../../../redis/redis.service.js';

@Injectable()
export class RedisIndicator {
    constructor(private readonly redisService: RedisService) { }

    async check() {
        const response = await this.redisService.ping();

        if (response !== 'PONG') {
            throw new Error('Redis health check failed.');
        }

        return {
            status: 'up' as const,
        };
    }
}
