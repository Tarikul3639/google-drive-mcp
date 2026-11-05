import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service.js';

@Injectable()
export class LogoutService {
    constructor(
        private readonly sessionService: SessionService,
    ) { }

    /**
     * Revoke an authentication session.
     */
    async logout(sessionId: string): Promise<void> {
        await this.sessionService.revoke(sessionId);
    }
}