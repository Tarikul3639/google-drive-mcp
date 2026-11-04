import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string) {
        return this.prisma.db.orm.public.User.first({ id });
    }

    async findByEmail(email: string) {
        return this.prisma.db.orm.public.User.whereUnique({ email }).first();
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.db.orm.public.User.where({ id }).update(dto);
    }
}
