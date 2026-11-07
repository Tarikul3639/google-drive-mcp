import {
    Injectable,
    UnauthorizedException,
    ExecutionContext,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { OAuthStateService } from '../../auth/services/oauth-state.service.js';

interface OAuthStateData {
    userId: string | null;
    redirectTo: string | null;
}

interface GoogleDriveRequest extends Request {
    oauthState?: string;
    oauthStateData?: OAuthStateData;
}

@Injectable()
export class GoogleDriveGuard extends AuthGuard('google-drive') {
    constructor(private readonly oauthStateService: OAuthStateService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<GoogleDriveRequest>();

        const isCallback = request.path.endsWith('/callback');

        if (isCallback) {
            const state = request.query.state;

            if (typeof state !== 'string' || !state) {
                throw new UnauthorizedException('OAuth state is missing.');
            }

            // Consume state only once.
            const stateData = await this.oauthStateService.consume(state);

            if (!stateData.userId) {
                throw new UnauthorizedException('Invalid OAuth state user.');
            }

            request.oauthStateData = stateData;
        } else {
            // Get authenticated application user.
            const userId = request.authenticatedUser?.id ?? request.auth?.sub;

            if (!userId) {
                throw new UnauthorizedException('Authentication required.');
            }

            const state = await this.oauthStateService.create({
                userId,
            });

            request.oauthState = state;
        }

        return (await super.canActivate(context)) as boolean;
    }

    getAuthenticateOptions(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<GoogleDriveRequest>();

        return {
            ...(request.oauthState ? { state: request.oauthState } : {}),
            accessType: 'offline',
            prompt: 'consent',
        };
    }
}
