import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import type { AccessTokenPayload } from '../interfaces/token-payload.interface.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.access_token;

        if (!token || typeof token !== 'string') {
            throw new UnauthorizedException('Access token is missing');
        }

        try {
            const payload =
                await this.jwtService.verifyAsync<AccessTokenPayload>(token);

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
