import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import type { Request } from 'express';

import { SessionService } from '../services/session.service.js';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = request.cookies?.refresh_token;

    if (typeof refreshToken !== 'string' || !refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    // Hash refresh token.
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    // Find session by refresh token hash.
    const session = await this.sessionService.findByTokenHash(tokenHash);

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    request.auth = {
      sub: session.userId,
      sid: session.id,
    };

    return true;
  }
}
