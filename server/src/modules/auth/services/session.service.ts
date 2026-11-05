import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import { RedisService } from '../../../redis/redis.service.js';
import { SessionData } from '../interfaces/session.interface.js';
import { ConfigService } from '../../../config/config.service.js';

@Injectable()
export class SessionService {
    private readonly logger = new Logger(SessionService.name);

    private readonly sessionPrefix = 'session:';
    private readonly sessionTTL: number;

    constructor(
        private readonly redis: RedisService,
        private readonly configService: ConfigService,
    ) {
        this.sessionTTL = Math.floor(this.configService.sessionTtl / 1000); // Convert milliseconds to seconds
    }

    // Create a new session
    async create(userId: string): Promise<string> {
        if (!userId) {
            throw new NotFoundException('User ID is required to create a session');
        }

        // Generate a unique session ID
        const sessionId = randomBytes(32).toString('hex');

        const session: SessionData = {
            userId,
            createdAt: new Date().toISOString(),
        };

        try {
            await this.redis.set(
                `${this.sessionPrefix}${sessionId}`,
                JSON.stringify(session),
                this.sessionTTL,
            );

            return sessionId;
        } catch (error) {
            this.logger.error('Failed to create session', error);
            throw new InternalServerErrorException('Could not create session');
        }
    }

    // Find a session by ID
    async findById(sessionId: string): Promise<SessionData | null> {
        // Validate sessionId
        if (!sessionId) {
            throw new NotFoundException('Session ID is required to find a session');
        }

        try {
            const session = await this.redis.get(`${this.sessionPrefix}${sessionId}`);

            if (!session) {
                return null;
            }

            return JSON.parse(session) as SessionData;
        } catch (error) {
            this.logger.error('Failed to retrieve session', error);
            throw new InternalServerErrorException('Could not retrieve session');
        }
    }

    // Validate a session
    async validate(sessionId: string): Promise<SessionData | null> {
        // Validate sessionId
        if (!sessionId) {
            throw new NotFoundException(
                'Session ID is required to validate a session',
            );
        }
        // Check if the session exists
        return this.findById(sessionId);
    }

    // Destroy a session
    async destroy(sessionId: string): Promise<void> {
        // Validate sessionId
        if (!sessionId) {
            throw new NotFoundException(
                'Session ID is required to destroy a session',
            );
        }

        try {
            await this.redis.del(`${this.sessionPrefix}${sessionId}`);
        } catch (error) {
            this.logger.error('Failed to destroy session', error);
            throw new InternalServerErrorException('Could not destroy session');
        }
    }

    // Refresh session expiration
    async refresh(sessionId: string): Promise<boolean> {
        // Validate sessionId
        if (sessionId) {
            throw new NotFoundException(
                'Session ID is required to refresh a session',
            );
        }

        try {
            const session = await this.findById(sessionId);

            if (!session) {
                return false;
            }

            await this.redis.set(
                `${this.sessionPrefix}${sessionId}`,
                JSON.stringify(session),
                this.sessionTTL,
            );

            return true;
        } catch (error) {
            this.logger.error('Failed to refresh session', error);
            throw error;
        }
    }
}
