import { Module } from '@nestjs/common';
import { LoginService } from './services/login.service.js';
import { LogoutService } from './services/logout.service.js';
import { SessionService } from './services/session.service.js';
import { AuthController } from './controller/auth.controller.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@Module({
  controllers: [AuthController],

  providers: [
    LoginService,
    LogoutService,
    SessionService,
  ],
  exports: [
    LoginService,
    LogoutService,
    SessionService,
  ],
})
export class AuthModule { }