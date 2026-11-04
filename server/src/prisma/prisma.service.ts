import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import type { Contract } from './generated/contract';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    readonly db: PostgresClient<Contract> = db;

    async onModuleInit(): Promise<void> {
        this.logger.log('Connecting to the database...');
        await this.db.connect();
        this.logger.log('Connected to the database');
    }

    async onModuleDestroy(): Promise<void> {
        await this.db.close();
    }
}
