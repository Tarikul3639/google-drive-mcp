import type { UserResponseDto } from '../../modules/users/dto/user-response.dto.js';
import type { GoogleUser } from '../../modules/auth/interfaces/google-user.interface.js';
import type { AccessTokenPayload } from '../../modules/auth/interfaces/token-payload.interface.js';

declare global {
    namespace Express {
        // Passport user object
        interface User extends GoogleUser {}

        // Extend the Request interface to include authenticated user information
        interface Request {
            authenticatedUser?: UserResponseDto;
            auth?: AccessTokenPayload;
            refreshTokenHash?: string;
        }
    }
}

export {};