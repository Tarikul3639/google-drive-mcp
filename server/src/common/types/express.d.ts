import type { UserResponseDto } from '../../modules/users/dto/user-response.dto.js';
import type { AccessTokenPayload } from '../../modules/auth/interfaces/token-payload.interface.js';

declare global {
    namespace Express {
        interface Request {
            user?: UserResponseDto;
            auth?: AccessTokenPayload;
            refreshTokenHash?: string;
        }
    }
}

export { };