
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

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

        const cacheKey = `user:${id}`;

        // Check Redis cache first
        const cachedUser = await this.redis.get(cacheKey);

        if (cachedUser) {
            return JSON.parse(cachedUser);
        }

        // Fetch user from database
        const user = await this.prisma.db.orm.public.User.first({ id });

        // Store user in Redis
        if (user) {
            await this.redis.set(
                cacheKey,
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

        const cacheKey = `user:email:${email}`;

        // Check Redis cache first
        const cachedUser = await this.redis.get(cacheKey);

        if (cachedUser) {
            return JSON.parse(cachedUser);
        }

        // Fetch user from database
        const user = await this.prisma.db.orm.public.User
            .whereUnique({ email })
            .first();

        // Store user in Redis
        if (user) {
            await this.redis.set(
                cacheKey,
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
        const updatedUser = await this.prisma.db.orm.public.User
            .where({ id })
            .update(dto);

        // Invalidate related cache
        await Promise.all([
            this.redis.del(`user:${id}`),
            this.redis.del(`user:email:${user.email}`),
        ]);

        return updatedUser;
    }
}
