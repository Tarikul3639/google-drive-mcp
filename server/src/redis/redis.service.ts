import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '../config/config.service.js';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private readonly redisUrl: string;
    private client: RedisClientType;

    constructor(private readonly configService: ConfigService) {
        this.redisUrl = this.configService.redisUrl;
    }

    // Initialize Redis client when the module is initialized
    async onModuleInit() {
        this.logger.log('🚀 Initializing Redis client...');

        this.client = createClient({
            url: this.redisUrl,
        });

        // Handle Redis client errors
        this.client.on('error', (err) => {
            this.logger.error('❌ Redis Client Error', err);
        });

        try {
            await this.client.connect();
            this.logger.log('✅ Redis client connected successfully.');
        } catch (error) {
            this.logger.error('❌ Failed to connect to Redis', error);
            throw error;
        }
    }

    // Close Redis client when the module is destroyed
    async onModuleDestroy() {
        if (this.client?.isOpen) {
            this.logger.log('🔌 Closing Redis client...');

            await this.client.quit();

            this.logger.log('👋 Redis client disconnected successfully.');
        }
    }


    // Set a value in Redis with an optional expiration time
    async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
        if (!this.client?.isOpen) {
            throw new Error('Redis client is not connected.');
        }

        if (expirationInSeconds) {
            await this.client.set(key, value, {
                EX: expirationInSeconds,
            });
        } else {
            await this.client.set(key, value);
        }
    }

    // Get a value from Redis
    async get(key: string): Promise<string | null> {
        if (!this.client?.isOpen) {
            throw new Error('Redis client is not connected.');
        }

        return await this.client.get(key);
    }

    // Delete a value from Redis
    async del(key: string): Promise<void> {
        if (!this.client?.isOpen) {
            throw new Error('Redis client is not connected.');
        }

        await this.client.del(key);
    }

    // Check if a key exists in Redis
    async exists(key: string): Promise<boolean> {
        if (!this.client?.isOpen) {
            throw new Error('Redis client is not connected.');
        }

        const result = await this.client.exists(key);
        return result === 1;
    }
}