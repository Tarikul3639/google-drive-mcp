import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service.js';
import { TokenService } from './token.service.js';
import { SessionService } from './session.service.js';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: TokenService, useValue: {} },
        { provide: SessionService, useValue: {} },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
