
import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service.js';

@Injectable()
export class LoginService {
    constructor(
        private readonly sessionService: SessionService,
    ) { }

    async login(userId: string): Promise<string> {
        return this.sessionService.create(userId);
    }
}
