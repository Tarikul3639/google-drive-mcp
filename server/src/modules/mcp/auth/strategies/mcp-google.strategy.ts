
import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

import { ConfigService } from '../../../../config/config.service.js';
import type { GoogleUser } from '../../../auth/interfaces/google-user.interface.js';

@Injectable()
export class McpGoogleStrategy extends PassportStrategy(
    Strategy,
    'mcp-google',
) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.googleClientId,
            clientSecret: configService.googleClientSecret,
            callbackURL: configService.mcpGoogleCallbackUrl,
            scope: ['email', 'profile'],
            passReqToCallback: false,
        });
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
    ): GoogleUser {
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
        };
    }
}
