import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service.js';
import { GoogleTokenService } from './google-token.service.js';

import type { GoogleDriveAuthResult } from '../interfaces/google-drive-auth.interface.js';

@Injectable()
export class GoogleIntegrationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly googleTokenService: GoogleTokenService,
    ) { }

    /**
     * Connects a user's Google account to the application.
     *
     * - Validates the user and Google account information.
     * - Checks whether the Google account is already connected.
     * - Prevents the same Google account from being connected to multiple users.
     * - Encrypts Google access and refresh tokens before database persistence.
     * - Creates a new GoogleAccount record or updates the existing one.
     *
     * @param userId - ID of the authenticated application user.
     * @param googleAccount - Google account information returned by OAuth.
     * @returns The created or updated GoogleAccount record.
     * @throws ConflictException If account information is invalid or already connected.
     */
    async connect(userId: string, googleAccount: GoogleDriveAuthResult) {
        // Validate the authenticated application user ID.
        if (!userId) {
            throw new ConflictException('User ID is required.');
        }

        // Extract Google account information.
        const { googleId, email, accessToken, refreshToken } = googleAccount;

        // Ensure the required Google account information is available.
        if (!googleId || !email || !accessToken) {
            throw new ConflictException('Google account information is incomplete.');
        }

        // Check whether the current user already has a connected Google account.
        const existingAccount =
            await this.prisma.db.orm.public.GoogleAccount.whereUnique({
                userId,
            }).first();

        // Check whether this Google account is already connected to another user.
        const existingGoogleAccount =
            await this.prisma.db.orm.public.GoogleAccount.whereUnique({
                googleId,
            }).first();

        // Prevent one Google account from being linked to multiple application users.
        if (existingGoogleAccount && existingGoogleAccount.userId !== userId) {
            throw new ConflictException(
                'This Google account is already connected to another user.',
            );
        }

        // Encrypt the Google access token before storing it in the database.
        const encryptedAccessToken = this.googleTokenService.encrypt(accessToken);

        // Encrypt the new refresh token if Google provides one.
        // Otherwise, preserve the previously stored refresh token.
        const encryptedRefreshToken = refreshToken
            ? this.googleTokenService.encrypt(refreshToken)
            : existingAccount?.refreshToken;

        // A refresh token is required for offline Google Drive API access.
        // If no previous refresh token exists, ask the user to reconnect.
        if (!encryptedRefreshToken) {
            throw new ConflictException(
                'Google refresh token is required. Please reconnect your Google account.',
            );
        }

        // Prepare Google account data for database persistence.
        const accountData = {
            googleId,
            email,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            expiresAt: null,
        };

        // Update the existing Google account if the user is already connected.
        if (existingAccount) {
            return await this.prisma.db.orm.public.GoogleAccount.where({
                userId,
            }).update(accountData);
        }

        // Create a new Google account connection for the user.
        return await this.prisma.db.orm.public.GoogleAccount.create({
            userId,
            ...accountData,
        });
    }

    /**
     * Finds a connected Google account using the application user ID.
     *
     * @param userId - ID of the application user.
     * @returns The GoogleAccount record or null if no account is connected.
     */
    async findByUserId(userId: string) {
        return await this.prisma.db.orm.public.GoogleAccount.whereUnique({
            userId,
        }).first();
    }

    /**
     * Checks whether the user has connected a Google account.
     *
     * @param userId - ID of the application user.
     * @returns True if a Google account exists, otherwise false.
     */
    async isConnected(userId: string): Promise<boolean> {
        // Retrieve the user's connected Google account.
        const account = await this.findByUserId(userId);

        return !!account;
    }

    /**
     * Disconnects the user's Google account from the application.
     *
     * - Checks whether a Google account is connected.
     * - Deletes the GoogleAccount record from the database.
     *
     * @param userId - ID of the application user.
     * @throws NotFoundException If no Google account is connected.
     */
    async disconnect(userId: string): Promise<void> {
        // Find the user's connected Google account.
        const account = await this.findByUserId(userId);

        // Ensure that a Google account exists before disconnecting.
        if (!account) {
            throw new NotFoundException('Google Drive account is not connected.');
        }

        // Delete the Google account connection from the database.
        await this.prisma.db.orm.public.GoogleAccount.whereUnique({
            userId,
        }).delete();
    }
}
