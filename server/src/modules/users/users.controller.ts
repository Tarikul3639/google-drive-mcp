import {
    Body,
    Controller,
    Get,
    Patch,
    Req,
    NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';

import {
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiOkResponse({ type: UserResponseDto })
    async getMe(@Req() req: Request): Promise<UserResponseDto> {
        const user = await this.usersService.findById(req.user!.id);

        return this.toUserResponse(user);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiOkResponse({ type: UserResponseDto })
    async updateMe(
        @Req() req: Request,
        @Body() dto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.update(req.user!.id, dto);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.toUserResponse(user);
    }

    private toUserResponse(user: UserResponseDto): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}