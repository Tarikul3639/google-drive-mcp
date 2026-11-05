import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserResponseDto } from '../../users/dto/user-response.dto.js';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserResponseDto | null => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request.user || null;
    },
);
