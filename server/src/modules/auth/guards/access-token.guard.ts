import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import type { AccessTokenPayload } from '../interfaces/token-payload.interface.js';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Access token is missing');
    }

    let payload: AccessTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (
      typeof payload.sub !== 'string' ||
      !payload.sub ||
      typeof payload.sid !== 'string' ||
      !payload.sid
    ) {
      throw new UnauthorizedException('Invalid access token payload');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    request.auth = payload;
    request.authenticatedUser = user;

    return true;
  }
}
