import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class DatabaseIndicator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async check() {

        const plan = this.prisma.db.raw.sql`SELECT 1`
            .returnsRow({ "?column?": "pg/int4@1" })
            .build();

        await this.prisma.db.query(plan);

        return {
            status: 'up' as const,
        };
    }
}