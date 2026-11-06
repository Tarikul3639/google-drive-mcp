import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controller/auth.controller.js';

import { TokenService } from './services/token.service.js';
import { SessionService } from './services/session.service.js';
import { LoginService } from './services/login.service.js';
import { LogoutService } from './services/logout.service.js';
import { RefreshService } from './services/refresh.service.js';
import { GoogleAuthService } from './services/google-auth.service.js';

import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';

import { GoogleStrategy } from './strategies/google.strategy.js';

import { UsersService } from '../users/users.service.js';
import { OAuthStateService } from './services/oauth-state.service.js';

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
        GoogleAuthService,
        GoogleStrategy,
        AccessTokenGuard,
        RefreshTokenGuard,
        GoogleAuthGuard,
        
        // Import UsersService from UsersModule
        UsersService,
        
        OAuthStateService,
    ],
    exports: [
        TokenService,
        SessionService,
        OAuthStateService
    ],
})
export class AuthModule { }