import {
    Body,
    Controller,
    Get,
    Patch,
    Req,
    NotFoundException,
    UseGuards,
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

import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';

@ApiTags('Users')
@ApiCookieAuth()
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * Get current user profile.
     */
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiOkResponse({ type: UserResponseDto })
    async getMe(@Req() request: Request): Promise<UserResponseDto> {
        const user = await this.usersService.findById(request.auth!.sub);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.toUserResponse(user);
    }

    /**
     * Update current user profile.
     */
    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiOkResponse({ type: UserResponseDto })
    async updateMe(
        @Req() request: Request,
        @Body() dto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.update(request.auth!.sub, dto);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.toUserResponse(user);
    }

    /**
     * Map user entity to response DTO.
     */
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
