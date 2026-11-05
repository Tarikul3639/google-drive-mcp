import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionService } from '../services/session.service.js';
import { ConfigService } from '../../../config/config.service.js';
import type { SessionData } from '../interfaces/session.interface.js';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly cookieName: string;

  constructor(
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {
    this.cookieName = this.configService.sessionCookieName;
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const sessionId = request.cookies?.[this.cookieName];

    if (!sessionId || typeof sessionId !== 'string') {
      throw new UnauthorizedException('Session ID is missing or invalid');
    }

    // Validate the session ID
    const session: SessionData | null = await this.sessionService.validate(sessionId);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    
    request.session = session;

    return true;
  }
}
