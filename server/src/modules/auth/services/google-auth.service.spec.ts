import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthService } from './google-auth.service.js';
import { UsersService } from '../../users/users.service.js';
import { TokenService } from './token.service.js';
import { SessionService } from './session.service.js';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuthService,
        { provide: UsersService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: SessionService, useValue: {} },
      ],
    }).compile();

    service = module.get<GoogleAuthService>(GoogleAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
