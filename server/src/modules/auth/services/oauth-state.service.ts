
import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { RedisService } from '../../../redis/redis.service.js';
import { RedisKeys } from '../../../redis/redis.keys.js';

interface CreateOAuthStateInput {
    userId?: string;
    redirectTo?: string;
}

interface OAuthStateData {
    userId: string | null;
    redirectTo: string | null;
}

@Injectable()
export class OAuthStateService {
    private readonly stateTtlSeconds = 5 * 60;

    constructor(private readonly redis: RedisService) { }

    /**
     * Generate a secure OAuth state and store it in Redis.
     */
    async create(data: CreateOAuthStateInput = {}): Promise<string> {
        const state = randomBytes(32).toString('base64url');

        const value: OAuthStateData = {
            userId: data.userId ?? null,
            redirectTo: data.redirectTo ?? null,
        };

        await this.redis.set(
            RedisKeys.oauthState(state),
            JSON.stringify(value),
            this.stateTtlSeconds,
        );

        return state;
    }

    /**
     * Atomically validate and consume an OAuth state.
     * A state can only be used once.
     */
    async consume(state: string): Promise<OAuthStateData> {
        if (!state) {
            throw new UnauthorizedException('OAuth state is missing.');
        }

        // GETDEL atomically retrieves and deletes the state.
        const value = await this.redis.getDel(RedisKeys.oauthState(state));

        if (!value) {
            throw new UnauthorizedException(
                'Invalid or expired OAuth state.',
            );
        }

        let data: OAuthStateData;

        try {
            data = JSON.parse(value) as OAuthStateData;
        } catch {
            throw new UnauthorizedException('Invalid OAuth state data.');
        }

        if (
            typeof data !== 'object' ||
            data === null ||
            !(
                data.userId === null ||
                typeof data.userId === 'string'
            ) ||
            !(
                data.redirectTo === null ||
                typeof data.redirectTo === 'string'
            )
        ) {
            throw new UnauthorizedException('Invalid OAuth state data.');
        }

        return data;
    }

    /**
     * Delete an OAuth state.
     */
    async delete(state: string): Promise<void> {
        if (!state) return;

        await this.redis.del(RedisKeys.oauthState(state));
    }
}
