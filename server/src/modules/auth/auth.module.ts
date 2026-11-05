import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controller/auth.controller.js';

import { TokenService } from './services/token.service.js';
import { SessionService } from './services/session.service.js';
import { LoginService } from './services/login.service.js';
import { LogoutService } from './services/logout.service.js';
import { RefreshService } from './services/refresh.service.js';

import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';

@Module({
    imports: [
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [
        TokenService,
        SessionService,
        LoginService,
        LogoutService,
        RefreshService,
        AccessTokenGuard,
        RefreshTokenGuard,
    ],
    exports: [
        TokenService,
        SessionService,
    ],
})
export class AuthModule {}