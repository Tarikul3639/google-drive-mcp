import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service.js';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-google-oauth20';
import type { GoogleDriveAuthResult } from '../interfaces/google-drive-auth.interface.js';

@Injectable()
export class GoogleDriveStrategy extends PassportStrategy(
    Strategy,
    'google-drive',
) {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.googleClientId,
            clientSecret: configService.googleClientSecret,
            callbackURL: configService.googleDriveCallbackUrl,
            scope: [
                'email',
                'profile',
                'https://www.googleapis.com/auth/drive.file',
            ],
        });
    }

    validate(
        accessToken: string,
        refreshToken: string,
        params: { expires_in?: number; scope?: string },
        profile: Profile,
    ): GoogleDriveAuthResult {
        const email = profile.emails?.[0]?.value;

        if (!email) {
            throw new UnauthorizedException(
                'Google account email not found.',
            );
        }

        return {
            googleId: profile.id,
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            accessToken,
            refreshToken: refreshToken || undefined,
            expiresIn: params.expires_in,
            scope: params.scope,
        };
    }
}