import { Module } from '@nestjs/common';

import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

import { DatabaseIndicator } from './indicators/database.indicator.js';
import { RedisIndicator } from './indicators/redis.indicator.js';
import { MemoryIndicator } from './indicators/memory.indicator.js';

@Module({
    controllers: [HealthController],
    providers: [
        HealthService,
        DatabaseIndicator,
        RedisIndicator,
        MemoryIndicator,
    ],
})
export class HealthModule { }
