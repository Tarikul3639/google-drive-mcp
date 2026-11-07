import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';

import { createHash, randomBytes } from 'node:crypto';

import { ConfigService } from '../../../../config/config.service.js';
import { RedisService } from '../../../../redis/redis.service.js';
import { RedisKeys } from '../../../../redis/redis.keys.js';

import { GoogleAuthService } from '../../../auth/services/google-auth.service.js';
import { OAuthClientService } from './oauth-client.service.js';

import type { GoogleUser } from '../../../auth/interfaces/google-user.interface.js';

interface AuthorizationState {
    clientId: string;
    redirectUri: string;
    codeChallenge: string;
    oauthState: string | null;
}

@Injectable()
export class OAuthAuthorizationService {
    private readonly stateTtl = 300;
    private readonly codeTtl = 300;

    constructor(
        private readonly configService: ConfigService,
        private readonly redis: RedisService,
        private readonly oauthClientService: OAuthClientService,
        private readonly googleAuthService: GoogleAuthService,
    ) { }

    async createAuthorizationUrl(query: Record<string, string>): Promise<string> {
        const {
            client_id,
            redirect_uri,
            response_type,
            code_challenge,
            code_challenge_method,
            state,
        } = query;

        if (
            !client_id ||
            !redirect_uri ||
            response_type !== 'code' ||
            !code_challenge ||
            code_challenge_method !== 'S256'
        ) {
            throw new BadRequestException('Invalid OAuth authorization request.');
        }

        // Validate S256 code challenge format.
        if (!/^[A-Za-z0-9_-]{43}$/.test(code_challenge)) {
            throw new BadRequestException('Invalid PKCE code challenge.');
        }

        const client = await this.oauthClientService.getClient(client_id);

        if (!client || !client.redirect_uris.includes(redirect_uri)) {
            throw new UnauthorizedException('Invalid OAuth client.');
        }

        const oauthState = randomBytes(32).toString('base64url');

        const stateData: AuthorizationState = {
            clientId: client_id,
            redirectUri: redirect_uri,
            codeChallenge: code_challenge,
            oauthState: state ?? null,
        };

        await this.redis.set(
            RedisKeys.oauthState(oauthState),
            JSON.stringify(stateData),
            this.stateTtl,
        );

        const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

        googleUrl.searchParams.set('client_id', this.configService.googleClientId);

        googleUrl.searchParams.set(
            'redirect_uri',
            this.configService.mcpGoogleCallbackUrl,
        );

        googleUrl.searchParams.set('response_type', 'code');
        googleUrl.searchParams.set('scope', 'email profile');
        googleUrl.searchParams.set('state', oauthState);

        return googleUrl.toString();
    }

    async completeAuthorization(
        googleUser: GoogleUser,
        state: string,
    ): Promise<{ redirectUrl: string }> {
        if (!state) {
            throw new UnauthorizedException('OAuth state is missing.');
        }

        // Atomically retrieve and delete state.
        const value = await this.redis.getDel(RedisKeys.oauthState(state));

        if (!value) {
            throw new UnauthorizedException('Invalid or expired OAuth state.');
        }

        const stateData = JSON.parse(value) as AuthorizationState;

        const client = await this.oauthClientService.getClient(stateData.clientId);

        if (!client || !client.redirect_uris.includes(stateData.redirectUri)) {
            throw new UnauthorizedException('Invalid OAuth client.');
        }

        const tokens = await this.googleAuthService.login(googleUser);

        // Generate a one-time authorization code.
        const authorizationCode = randomBytes(32).toString('base64url');

        // Store only the hash as the Redis key.
        const codeHash = createHash('sha256')
            .update(authorizationCode)
            .digest('hex');

        await this.redis.set(
            RedisKeys.oauthAuthorizationCode(codeHash),
            JSON.stringify({
                clientId: stateData.clientId,
                redirectUri: stateData.redirectUri,
                codeChallenge: stateData.codeChallenge,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            }),
            this.codeTtl,
        );

        const redirectUrl = new URL(stateData.redirectUri);

        redirectUrl.searchParams.set('code', authorizationCode);

        if (stateData.oauthState) {
            redirectUrl.searchParams.set('state', stateData.oauthState);
        }

        return {
            redirectUrl: redirectUrl.toString(),
        };
    }
}
