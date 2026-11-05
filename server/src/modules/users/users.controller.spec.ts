import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { TokenService } from '../auth/services/token.service.js';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: TokenService, useValue: {} },
        { provide: AccessTokenGuard, useValue: {} },
        {
          provide: UsersService,
          useValue: {
            findById: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
