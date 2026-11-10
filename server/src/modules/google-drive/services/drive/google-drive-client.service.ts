import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  google,
  type drive_v3,
  type docs_v1,
  type sheets_v4,
  type slides_v1,
} from 'googleapis';

import { ConfigService } from '../../../../config/config.service.js';
import { GoogleIntegrationService } from '../../../google-integration/services/google-integration.service.js';
import { GoogleTokenService } from '../../../google-integration/services/google-token.service.js';

// Keep all Google API clients together so Drive, Docs, Sheets and Slides share one OAuth session.
interface CachedGoogleClient {
  drive: drive_v3.Drive;
  docs: docs_v1.Docs;
  sheets: sheets_v4.Sheets;
  slides: slides_v1.Slides;
}

interface GoogleOAuthTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}

// Creates and caches authenticated Google API clients for each connected user.
@Injectable()
export class GoogleDriveClientService implements OnModuleDestroy {
  private readonly logger = new Logger(GoogleDriveClientService.name);
  private readonly clients = new Map<string, CachedGoogleClient>();
  private readonly pendingClients = new Map<
    string,
    Promise<CachedGoogleClient>
  >();

  constructor(
    private readonly configService: ConfigService,
    private readonly googleIntegrationService: GoogleIntegrationService,
    private readonly googleTokenService: GoogleTokenService,
  ) {}

  // Returns cached API clients or initializes them once per user.
  private async getClients(userId: string): Promise<CachedGoogleClient> {
    if (!userId)
      throw new UnauthorizedException('User authentication required.');

    const cached = this.clients.get(userId);
    if (cached) return cached;

    const pending = this.pendingClients.get(userId);
    if (pending) return pending;

    const initialization = this.createClients(userId);
    this.pendingClients.set(userId, initialization);
    try {
      const clients = await initialization;
      this.clients.set(userId, clients);
      return clients;
    } finally {
      if (this.pendingClients.get(userId) === initialization) {
        this.pendingClients.delete(userId);
      }
    }
  }

  // Returns the authenticated Google Drive API client.

  async getClient(userId: string): Promise<drive_v3.Drive> {
    return (await this.getClients(userId)).drive;
  }

  // Returns the authenticated Google Docs API client.

  async getDocsClient(userId: string): Promise<docs_v1.Docs> {
    return (await this.getClients(userId)).docs;
  }

  // Returns the authenticated Google Sheets API client.

  async getSheetsClient(userId: string): Promise<sheets_v4.Sheets> {
    return (await this.getClients(userId)).sheets;
  }

  // Returns the authenticated Google Slides API client.

  async getSlidesClient(userId: string): Promise<slides_v1.Slides> {
    return (await this.getClients(userId)).slides;
  }

  // Builds authenticated Google API clients using the user's stored credentials.

  private async createClients(userId: string): Promise<CachedGoogleClient> {
    const account = await this.googleIntegrationService.findByUserId(userId);
    if (!account)
      throw new NotFoundException('Google Drive account is not connected.');
    if (!account.accessToken || !account.refreshToken) {
      throw new UnauthorizedException(
        'Google Drive authorization tokens are missing. Please reconnect your account.',
      );
    }

    const accessToken = this.googleTokenService.decrypt(account.accessToken);
    const refreshToken = this.googleTokenService.decrypt(account.refreshToken);
    const oauth2Client = new google.auth.OAuth2(
      this.configService.googleClientId,
      this.configService.googleClientSecret,
      this.configService.googleDriveCallbackUrl,
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: account.expiresAt?.getTime() ?? undefined,
    });

    // Google may rotate access/refresh tokens; persist refreshed credentials encrypted.
    oauth2Client.on('tokens', (tokens) => {
      void this.persistTokens(userId, tokens).catch((error: unknown) => {
        this.logger.error(
          `Failed to persist Google tokens for user ${userId}.`,
          error instanceof Error ? error.stack : String(error),
        );
      });
    });

    return {
      drive: google.drive({ version: 'v3', auth: oauth2Client }),
      docs: google.docs({ version: 'v1', auth: oauth2Client }),
      sheets: google.sheets({ version: 'v4', auth: oauth2Client }),
      slides: google.slides({ version: 'v1', auth: oauth2Client }),
    };
  }

  // Persists refreshed OAuth credentials securely.

  private async persistTokens(
    userId: string,
    tokens: GoogleOAuthTokens,
  ): Promise<void> {
    const updateData: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
    } = {};
    if (tokens.access_token) {
      updateData.accessToken = this.googleTokenService.encrypt(
        tokens.access_token,
      );
    }
    if (tokens.refresh_token) {
      updateData.refreshToken = this.googleTokenService.encrypt(
        tokens.refresh_token,
      );
    }
    if (tokens.expiry_date != null)
      updateData.expiresAt = new Date(tokens.expiry_date);
    if (Object.keys(updateData).length === 0) return;
    await this.googleIntegrationService.updateTokens(userId, updateData);
  }

  // Invalidates the cached client for the specified user.

  invalidateClient(userId: string): void {
    this.clients.delete(userId);
  }

  // Clears in-memory client state when the module shuts down.

  onModuleDestroy(): void {
    this.clients.clear();
    this.pendingClients.clear();
  }
}
