import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from '../../config/config.service.js';
import { AuthController } from './controller/auth.controller.js';

import { SessionService } from './services/session.service.js';
import { LoginService } from './services/login.service.js';
import { LogoutService } from './services/logout.service.js';
import { RefreshService } from './services/refresh.service.js';
import { GoogleAuthService } from './services/google-auth.service.js';

import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';

import { GoogleStrategy } from './strategies/google.strategy.js';

import { UsersService } from '../users/users.service.js';
import { OAuthStateService } from './services/oauth-state.service.js';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.jwtAccessSecret,
                signOptions: {
                    expiresIn: configService.jwtAccessTtlMs / 1000,
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        SessionService,
        LoginService,
        LogoutService,
        RefreshService,
        GoogleAuthService,
        GoogleStrategy,
        AccessTokenGuard,
        RefreshTokenGuard,
        UsersService,
        OAuthStateService,
    ],
    exports: [
        JwtModule,
        SessionService,
        OAuthStateService,
        GoogleAuthService,
        RefreshService,
        AccessTokenGuard,
        RefreshTokenGuard,
    ],
})
export class AuthModule { }
