import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { ConfigService } from '../../../config/config.service.js';
import { LoginService } from '../services/login.service.js';
import { LogoutService } from '../services/logout.service.js';
import { RefreshService } from '../services/refresh.service.js';
import { AccessTokenGuard } from '../guards/access-token.guard.js';
import { RefreshTokenGuard } from '../guards/refresh-token.guard.js';
import { TokenService } from '../services/token.service.js';
import { SessionService } from '../services/session.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: ConfigService, useValue: {} },
        { provide: LoginService, useValue: {} },
        { provide: LogoutService, useValue: {} },
        { provide: RefreshService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: SessionService, useValue: {} },
        { provide: AccessTokenGuard, useValue: {} },
        { provide: RefreshTokenGuard, useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
