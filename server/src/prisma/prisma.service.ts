import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import type { Contract } from './generated/contract';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleDestroy, OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);

    readonly db: PostgresClient<Contract> = db;

    async onModuleInit(): Promise<void> {
        this.logger.log('🚀 Initializing database connection...');

        try {
            await this.db.connect();
            this.logger.log('✅ Database connected successfully.');
        } catch (error) {
            this.logger.error('❌ Failed to connect to database.', error);
            throw error;
        }
    }

    async onModuleDestroy(): Promise<void> {
        this.logger.log('🔌 Closing database connection...');

        try {
            await this.db.close();
            this.logger.log('👋 Database disconnected successfully.');
        } catch (error) {
            this.logger.error('❌ Failed to close database connection.', error);
            throw error;
        }
    }
}