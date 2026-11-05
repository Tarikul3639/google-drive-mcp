import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service.js';

@Injectable()
export class LogoutService {
    constructor(
        private readonly sessionService: SessionService,
    ) { }

    async logout(sessionId: string): Promise<void> {
        await this.sessionService.destroy(sessionId);
    }
}
