import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../../config/config.service.js';
import { LoginService } from './login.service.js';
import { SessionService } from './session.service.js';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: SessionService, useValue: {} },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
