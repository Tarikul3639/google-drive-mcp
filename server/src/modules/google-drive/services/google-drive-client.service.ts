import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
    OnModuleDestroy,
} from '@nestjs/common';
import { google, type drive_v3 } from 'googleapis';

import { ConfigService } from '../../../config/config.service.js';
import { GoogleIntegrationService } from '../../google-integration/services/google-integration.service.js';
import { GoogleTokenService } from '../../google-integration/services/google-token.service.js';

interface CachedGoogleClient {
    drive: drive_v3.Drive;
}

interface GoogleOAuthTokens {
    access_token?: string | null;
    refresh_token?: string | null;
    expiry_date?: number | null;
}

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
    ) { }

    /**
     * Returns an existing or newly created authenticated Drive client.
     */
    async getClient(userId: string): Promise<drive_v3.Drive> {
        if (!userId) {
            throw new UnauthorizedException('User authentication required.');
        }

        // Return cached client.
        const cachedClient = this.clients.get(userId);

        if (cachedClient) {
            return cachedClient.drive;
        }

        // Reuse an ongoing initialization request.
        const pendingClient = this.pendingClients.get(userId);

        if (pendingClient) {
            const client = await pendingClient;
            return client.drive;
        }

        // Initialize a new client.
        const initialization = this.createClient(userId);

        this.pendingClients.set(userId, initialization);

        try {
            const client = await initialization;

            this.clients.set(userId, client);

            return client.drive;
        } finally {
            if (this.pendingClients.get(userId) === initialization) {
                this.pendingClients.delete(userId);
            }
        }
    }

    /**
     * Creates a new authenticated Google Drive client.
     */
    private async createClient(userId: string): Promise<CachedGoogleClient> {
        const account = await this.googleIntegrationService.findByUserId(userId);

        if (!account) {
            throw new NotFoundException('Google Drive account is not connected.');
        }

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

        // Listen for newly issued OAuth tokens.
        oauth2Client.on('tokens', (tokens) => {
            void this.persistTokens(userId, tokens).catch((error: unknown) => {
                this.logger.error(
                    `Failed to persist Google tokens for user ${userId}.`,
                    error instanceof Error ? error.stack : String(error),
                );
            });
        });

        const driveClient = google.drive({
            version: 'v3',
            auth: oauth2Client,
        });

        return {
            drive: driveClient,
        };
    }

    /**
     * Encrypts and persists newly issued Google OAuth tokens.
     */
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

        if (tokens.expiry_date != null) {
            updateData.expiresAt = new Date(tokens.expiry_date);
        }

        if (Object.keys(updateData).length === 0) {
            return;
        }

        await this.googleIntegrationService.updateTokens(userId, updateData);
    }

    /**
     * Invalidates a user's cached Google Drive client.
     */
    invalidateClient(userId: string): void {
        this.clients.delete(userId);
    }

    /**
     * Clears cached clients during module destruction.
     */
    onModuleDestroy(): void {
        this.clients.clear();
        this.pendingClients.clear();
    }
}
