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
     * Handle OAuth state before Passport authentication.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<OAuthRequest>();

        // Google OAuth callback
        if (request.path.endsWith('/google/callback')) {
            const state = request.query.state;

            if (typeof state !== 'string' || !state) {
                throw new UnauthorizedException('OAuth state is missing.');
            }

            // Validate and atomically consume the state.
            request.oauthStateData = await this.oauthStateService.consume(state);
        }

        // Start Google OAuth login
        else if (request.path.endsWith('/google')) {
            request.oauthState = await this.oauthStateService.create();
        } else {
            throw new UnauthorizedException('Invalid Google OAuth route.');
        }

        return (await super.canActivate(context)) as boolean;
    }

    /**
     * Pass the generated state to Passport's authorization request.
     */
    getAuthenticateOptions(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<OAuthRequest>();

        return request.oauthState ? { state: request.oauthState } : {};
    }
}
