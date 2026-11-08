import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../users/users.service.js';
import { AccessTokenGuard } from './access-token.guard.js';

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;

  const jwtService = {
    verifyAsync: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenGuard,
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: UsersService,
          useValue: { findById: vi.fn().mockResolvedValue({ id: 'user-123' }) },
        },
      ],
    }).compile();

    guard = module.get<AccessTokenGuard>(AccessTokenGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access with a valid access token', async () => {
      const payload = {
        sub: 'user-123',
        sid: 'session-123',
      };

      jwtService.verifyAsync.mockResolvedValue(payload);

      const request = {
        cookies: {
          access_token: 'valid-access-token',
        },
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(request).toHaveProperty('auth', payload);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(
        'valid-access-token',
      );
    });

    it('should throw UnauthorizedException when token is missing', async () => {
      const request = {
        cookies: {},
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrow(
        'Access token is missing',
      );

      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      jwtService.verifyAsync.mockRejectedValue(
        new Error('Invalid token'),
      );

      const request = {
        cookies: {
          access_token: 'invalid-token',
        },
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid or expired access token',
      );
    });

    it('should reject an invalid token payload', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: '',
        sid: 'session-123',
      });

      const request = {
        cookies: {
          access_token: 'valid-access-token',
        },
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid access token payload',
      );
    });
  });
});
