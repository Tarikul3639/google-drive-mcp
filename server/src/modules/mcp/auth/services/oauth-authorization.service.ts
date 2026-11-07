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
import type { ConsentRequestDto } from '../dto/consent-request.dto.js';
import type { AuthorizationRequest } from '../interfaces/authorization-request.interface.js';

import {
  MCP_SCOPE_MAP,
  toMcpScopes,
  toOAuthScope,
} from '../../../../common/constants/mcp-scopes.js';
import type { McpScope } from '../../../../common/constants/prisma-enums.js';

interface AuthorizationState {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  clientState: string | null;
  scopes: McpScope[];
}

interface PendingConsent {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  clientState: string | null;
  scopes: McpScope[];
  googleUser: GoogleUser;
}

@Injectable()
export class OAuthAuthorizationService {
  private readonly stateTtl = 300;
  private readonly consentTtl = 300;
  private readonly codeTtl = 300;

  private readonly supportedScopes = Object.values(MCP_SCOPE_MAP);

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly oauthClientService: OAuthClientService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  /**
   * Validates the OAuth authorization request and redirects
   * the user to Google's authentication page.
   */
  async createAuthorizationUrl(query: AuthorizationRequest): Promise<string> {
    const {
      client_id,
      redirect_uri,
      response_type,
      code_challenge,
      code_challenge_method,
      state,
      scope,
    } = query;

    // Validate required OAuth parameters.
    if (
      !client_id ||
      !redirect_uri ||
      response_type !== 'code' ||
      !code_challenge ||
      code_challenge_method !== 'S256'
    ) {
      throw new BadRequestException('Invalid OAuth authorization request.');
    }

    // Validate PKCE S256 challenge format.
    if (!/^[A-Za-z0-9_-]{43}$/.test(code_challenge)) {
      throw new BadRequestException('Invalid PKCE code challenge.');
    }

    // Validate the registered OAuth client and exact redirect URI.
    const client = await this.oauthClientService.getClient(client_id);

    if (!client || !client.redirect_uris.includes(redirect_uri)) {
      throw new UnauthorizedException('Invalid OAuth client.');
    }

    // Validate requested scopes.
    const requestedOAuthScopes = scope
      ? [...new Set(scope.split(/\s+/).filter(Boolean))]
      : ['drive:read'];

    if (
      requestedOAuthScopes.some(
        (requestedScope) => !this.supportedScopes.includes(requestedScope),
      )
    ) {
      throw new BadRequestException('Unsupported OAuth scope.');
    }

    const requestedScopes = toMcpScopes(requestedOAuthScopes.join(' '));

    const clientScopes = client.scope.split(/\s+/).filter(Boolean);

    if (
      requestedOAuthScopes.some(
        (requestedScope) => !clientScopes.includes(requestedScope),
      )
    ) {
      throw new BadRequestException(
        'Requested scope is not registered for this OAuth client.',
      );
    }

    // Generate a cryptographically secure state for Google's OAuth flow.
    const googleState = randomBytes(32).toString('base64url');

    const stateData: AuthorizationState = {
      clientId: client_id,
      redirectUri: redirect_uri,
      codeChallenge: code_challenge,
      clientState: state || null,
      scopes: requestedScopes,
    };

    // Store the original authorization request temporarily in Redis.
    await this.redis.set(
      RedisKeys.oauthState(googleState),
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
    googleUrl.searchParams.set('state', googleState);

    return googleUrl.toString();
  }

  /**
   * Validates and consumes Google's OAuth state.
   * Creates a temporary consent transaction for the authenticated user.
   */
  async createConsentRequest(
    googleUser: GoogleUser,
    googleState: string,
  ): Promise<{ consentUrl: string }> {
    if (!googleState) {
      throw new UnauthorizedException('OAuth state is missing.');
    }

    // Atomically retrieve and delete Google state to prevent replay.
    const value = await this.redis.getDel(RedisKeys.oauthState(googleState));

    if (!value) {
      throw new UnauthorizedException('Invalid or expired OAuth state.');
    }

    const stateData = JSON.parse(value) as AuthorizationState;

    // Revalidate the client and redirect URI before continuing.
    const client = await this.oauthClientService.getClient(stateData.clientId);

    if (!client || !client.redirect_uris.includes(stateData.redirectUri)) {
      throw new UnauthorizedException('Invalid OAuth client.');
    }

    // Generate a separate, unpredictable consent transaction ID.
    const transaction = randomBytes(32).toString('base64url');

    const pendingConsent: PendingConsent = {
      ...stateData,
      googleUser,
    };

    // Keep the pending consent short-lived.
    await this.redis.set(
      RedisKeys.oauthConsent(transaction),
      JSON.stringify(pendingConsent),
      this.consentTtl,
    );

    // Redirect the authenticated user to the consent page.
    const consentUrl = new URL(
      `${this.configService.mcpAuthorizationServer}/api/mcp/oauth/consent`,
    );

    consentUrl.searchParams.set('transaction', transaction);

    return {
      consentUrl: consentUrl.toString(),
    };
  }

  /**
   * Returns the OAuth client and requested permissions
   * required to display the consent page.
   */
  async getConsentDetails(transaction: string) {
    if (!transaction) {
      throw new BadRequestException('Consent transaction is required.');
    }

    // Read the pending consent without consuming it.
    const value = await this.redis.get(RedisKeys.oauthConsent(transaction));

    if (!value) {
      throw new UnauthorizedException(
        'Invalid or expired consent transaction.',
      );
    }

    const consentData = JSON.parse(value) as PendingConsent;

    const client = await this.oauthClientService.getClient(
      consentData.clientId,
    );

    if (!client || !client.redirect_uris.includes(consentData.redirectUri)) {
      throw new UnauthorizedException('Invalid OAuth client.');
    }

    // Never expose Google user credentials or tokens to the frontend.
    return {
      transaction,
      client: {
        clientId: client.client_id,
        name: client.client_name,
      },
      scopes: consentData.scopes.map((mcpScope) => MCP_SCOPE_MAP[mcpScope]),
    };
  }

  /**
   * Processes the user's Allow or Deny decision.
   */
  async completeConsent(
    body: ConsentRequestDto,
  ): Promise<{ redirectUrl: string }> {
    if (!body.transaction) {
      throw new BadRequestException('Consent transaction is required.');
    }

    // Atomically consume the transaction so it cannot be reused.
    const value = await this.redis.getDel(
      RedisKeys.oauthConsent(body.transaction),
    );

    if (!value) {
      throw new UnauthorizedException(
        'Invalid or expired consent transaction.',
      );
    }

    const consentData = JSON.parse(value) as PendingConsent;

    // Revalidate the client and redirect URI.
    const client = await this.oauthClientService.getClient(
      consentData.clientId,
    );

    if (!client || !client.redirect_uris.includes(consentData.redirectUri)) {
      throw new UnauthorizedException('Invalid OAuth client.');
    }

    const redirectUrl = new URL(consentData.redirectUri);

    // Handle the user's denial.
    if (body.decision === 'deny') {
      redirectUrl.searchParams.set('error', 'access_denied');
      redirectUrl.searchParams.set(
        'error_description',
        'The resource owner denied the authorization request.',
      );

      if (consentData.clientState) {
        redirectUrl.searchParams.set('state', consentData.clientState);
      }

      return {
        redirectUrl: redirectUrl.toString(),
      };
    }

    // Create application tokens only after user consent.
    const { userId } = await this.googleAuthService.login(
      consentData.googleUser,
    );

    // Generate a one-time authorization code.
    const authorizationCode = randomBytes(32).toString('base64url');

    // Store only the SHA-256 hash of the authorization code.
    const codeHash = createHash('sha256')
      .update(authorizationCode)
      .digest('hex');

    // Store the authorization data temporarily in Redis.
    await this.redis.set(
      RedisKeys.oauthAuthorizationCode(codeHash),
      JSON.stringify({
        clientId: consentData.clientId,
        userId,
        redirectUri: consentData.redirectUri,
        codeChallenge: consentData.codeChallenge,
        scope: toOAuthScope(consentData.scopes),
      }),
      this.codeTtl,
    );

    // Redirect the user back to the registered MCP client.
    redirectUrl.searchParams.set('code', authorizationCode);

    if (consentData.clientState) {
      redirectUrl.searchParams.set('state', consentData.clientState);
    }

    return {
      redirectUrl: redirectUrl.toString(),
    };
  }
}
