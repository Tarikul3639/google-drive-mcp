import type { UserResponseDto } from '@/modules/users/dto/user-response.dto.js';
import type { SessionData } from '@/modules/auth/interfaces/session.interface.js';

declare global {
    namespace Express {
        interface Request {
            user?: UserResponseDto;
            session?: SessionData;
        }
    }
}

export {};