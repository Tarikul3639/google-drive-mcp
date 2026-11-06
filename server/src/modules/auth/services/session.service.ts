import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service.js';
import { RedisService } from '../../../redis/redis.service.js';
import { RedisKeys } from '../../../redis/redis.keys.js';

import type {
    CreateSessionInput,
    RotateRefreshTokenInput,
} from '../interfaces/session.interface.js';

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService,
    ) { }

    /**
     * Create a new authentication session.
     */
    async create(data: CreateSessionInput): Promise<{ id: string }> {
        const session = await this.prisma.db.orm.public.AuthSession.select(
            'id',
        ).create({
            userId: data.userId,
            tokenHash: data.tokenHash,
            expiresAt: data.expiresAt,
        });

        await this.redisService.set(
            RedisKeys.authSessionById(session.id),
            JSON.stringify({
                id: session.id,
                userId: data.userId,
                tokenHash: data.tokenHash,
                expiresAt: data.expiresAt,
            }),
        );

        return session;
    }

    /**
     * Revoke an authentication session.
     */
    async revoke(sessionId: string): Promise<void> {
        const session = await this.prisma.db.orm.public.AuthSession.where({
            id: sessionId,
        }).first();

        await this.prisma.db.orm.public.AuthSession.where({ id: sessionId }).update(
            {
                revokedAt: new Date(),
            },
        );

        if (session) {
            await this.redisService.del(
                RedisKeys.authSessionByToken(session.tokenHash),
            );
        }

        await this.redisService.del(RedisKeys.authSessionById(sessionId));
    }

    /**
     * Find a session by its refresh token hash.
     */
    async findByTokenHash(tokenHash: string) {
        // PostgreSQL remains authoritative for authentication.
        const session = await this.prisma.db.orm.public.AuthSession.where({
            tokenHash,
        }).first();

        if (!session) {
            await this.redisService.del(RedisKeys.authSessionByToken(tokenHash));
            return null;
        }

        return session;
    }

    /**
     * Rotate an existing refresh token.
     */
    async rotateRefreshToken(
        data: RotateRefreshTokenInput,
    ): Promise<{ id: string; userId: string } | null> {
        const session = await this.findByTokenHash(data.oldTokenHash);

        if (
            !session ||
            session.revokedAt ||
            session.expiresAt.getTime() <= Date.now()
        ) {
            return null;
        }

        await this.prisma.db.orm.public.AuthSession.where({
            tokenHash: data.oldTokenHash,
        }).update({
            tokenHash: data.newTokenHash,
            expiresAt: data.expiresAt,
        });

        // Invalidate old cache.
        await this.redisService.del(
            RedisKeys.authSessionByToken(data.oldTokenHash),
        );

        await this.redisService.set(
            RedisKeys.authSessionById(session.id),
            JSON.stringify({
                id: session.id,
                userId: session.userId,
                tokenHash: data.newTokenHash,
                expiresAt: data.expiresAt,
            }),
        );

        return {
            id: session.id,
            userId: session.userId,
        };
    }
}
