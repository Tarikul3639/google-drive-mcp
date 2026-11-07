import type { UserResponseDto } from '../../modules/users/dto/user-response.dto.js';
import type { GoogleUser } from '../../modules/auth/interfaces/google-user.interface.js';
import type { GoogleDriveAuthResult } from '../../modules/google-integration/interfaces/google-drive-auth.interface.js';
import type { AccessTokenPayload } from '../../modules/auth/interfaces/token-payload.interface.js';

interface OAuthStateData {
    userId: string | null;
    redirectTo: string | null;
}

declare global {
    namespace Express {
        interface User extends GoogleUser, GoogleDriveAuthResult {}

        interface Request {
            authenticatedUser?: UserResponseDto;
            auth?: AccessTokenPayload;
            refreshTokenHash?: string;

            oauthState?: string;
            oauthStateData?: OAuthStateData;
        }
    }
}

export {};