import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { RedisKeys } from '../../redis/redis.keys.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { GoogleUser } from '../auth/interfaces/google-user.interface.js';

@Injectable()
export class UsersService {
    private readonly cacheTTL = 3600;

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    async findById(id: string) {
        // Validate the ID
        if (!id) {
            throw new NotFoundException('User ID is required');
        }

        // Check Redis cache first
        const cachedUser = await this.redis.get(RedisKeys.userById(id));

        if (cachedUser) {
            return JSON.parse(cachedUser);
        }

        // Fetch user from database
        const user = await this.prisma.db.orm.public.User.first({ id });

        // Store user in Redis
        if (user) {
            await this.redis.set(
                RedisKeys.userById(id),
                JSON.stringify(user),
                this.cacheTTL,
            );
        }

        return user;
    }

    async findByEmail(email: string) {
        // Validate the email
        if (!email) {
            throw new NotFoundException('User email is required');
        }

        // Check Redis cache first
        const cachedUser = await this.redis.get(RedisKeys.userByEmail(email));

        if (cachedUser) {
            return JSON.parse(cachedUser);
        }

        // Fetch user from database
        const user = await this.prisma.db.orm.public.User.whereUnique({
            email,
        }).first();

        // Store user in Redis
        if (user) {
            await this.redis.set(
                RedisKeys.userByEmail(email),
                JSON.stringify(user),
                this.cacheTTL,
            );
        }

        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        // Validate the ID
        if (!id) {
            throw new NotFoundException('User ID is required');
        }

        //  Check if the user exists
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Update user in database
        const updatedUser = await this.prisma.db.orm.public.User.where({
            id,
        }).update(dto);

        // Invalidate related cache
        await Promise.all([
            this.redis.del(RedisKeys.userById(id)),
            this.redis.del(RedisKeys.userByEmail(user.email)),
        ]);

        return updatedUser;
    }

    // Find or create a user based on Google OAuth information
    async findOrCreateGoogleUser(googleUser: GoogleUser) {
        const { googleId, email, name, picture } = googleUser;

        if (!googleId || !email) {
            throw new NotFoundException('Google ID and email are required.');
        }

        // Find user by Google ID.
        const existingGoogleUser = await this.prisma.db.orm.public.User.whereUnique(
            { googleId },
        ).first();

        if (existingGoogleUser) {
            return existingGoogleUser;
        }

        // Check whether the email already belongs to another account.
        const existingEmailUser = await this.prisma.db.orm.public.User.whereUnique({
            email,
        }).first();

        if (existingEmailUser) {
            throw new ConflictException('An account with this email already exists.');
        }

        // Create a new user.
        const user = await this.prisma.db.orm.public.User.create({
            googleId,
            email,
            name: name || null,
            picture: picture || null,
        });

        return user;
    }
}
