import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { OAuthStateService } from '../services/oauth-state.service.js';

interface OAuthStateData {
  userId: string | null;
  redirectTo: string | null;
}

interface OAuthRequest extends Request {
  oauthState?: string;
  oauthStateData?: OAuthStateData;
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly oauthStateService: OAuthStateService) {
    super();
  }

  /**
   * Handles OAuth state generation and validation
   * before Passport processes Google authentication.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<OAuthRequest>();

    const isCallback = request.path.endsWith('/google/callback');
    const isLogin = request.path.endsWith('/google');

    if (isCallback) {
      const state = request.query.state;

      if (typeof state !== 'string' || !state) {
        throw new UnauthorizedException('OAuth state is missing.');
      }

      // Validate and atomically consume the OAuth state.
      request.oauthStateData = await this.oauthStateService.consume(state);
    } else if (isLogin) {
      // Generate a new OAuth state for this login attempt.
      request.oauthState = await this.oauthStateService.create();
    } else {
      throw new UnauthorizedException('Invalid Google OAuth route.');
    }

    return (await super.canActivate(context)) as boolean;
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<OAuthRequest>();

    // The custom Redis state is passed as a literal query parameter.
    // Do not enable Passport's session-backed state store for this flow.
    return request.oauthState ? { state: request.oauthState } : {};
  }
}
