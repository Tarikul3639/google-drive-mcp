import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { TokenService } from '../services/token.service.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const token = request.cookies?.access_token;

        if (!token || typeof token !== 'string') {
            throw new UnauthorizedException('Access token is missing');
        }

        try {
            const payload =
                await this.tokenService.verifyAccessToken(token);

            if (
                typeof payload.sub !== 'string' ||
                !payload.sub ||
                typeof payload.sid !== 'string' ||
                !payload.sid
            ) {
                throw new UnauthorizedException('Invalid access token payload');
            }

            request.auth = payload;

            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}