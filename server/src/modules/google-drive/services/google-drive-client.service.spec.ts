// Covers Google API client initialization, caching, token handling, and cleanup.
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { GoogleDriveClientService } from './google-drive-client.service.js';

import { ConfigService } from '../../../config/config.service.js';
import { GoogleIntegrationService } from '../../google-integration/services/google-integration.service.js';
import { GoogleTokenService } from '../../google-integration/services/google-token.service.js';

// Covers Google API client initialization, caching, token handling, and cleanup.
describe('GoogleDriveClientService', () => {
  let service: GoogleDriveClientService;

  let googleIntegrationService: {
    findByUserId: ReturnType<typeof vi.fn>;
    updateTokens: ReturnType<typeof vi.fn>;
  };

  let googleTokenService: {
    decrypt: ReturnType<typeof vi.fn>;
    encrypt: ReturnType<typeof vi.fn>;
  };

  let configService: {
    googleClientId: string;
    googleClientSecret: string;
    googleDriveCallbackUrl: string;
  };

  beforeEach(async () => {
    googleIntegrationService = {
      findByUserId: vi.fn(),
      updateTokens: vi.fn(),
    };

    googleTokenService = {
      decrypt: vi.fn((token: string) => `decrypted-${token}`),
      encrypt: vi.fn((token: string) => `encrypted-${token}`),
    };

    configService = {
      googleClientId: 'test-client-id',
      googleClientSecret: 'test-client-secret',
      googleDriveCallbackUrl: 'http://localhost:5000/callback',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleDriveClientService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: GoogleIntegrationService,
          useValue: googleIntegrationService,
        },
        {
          provide: GoogleTokenService,
          useValue: googleTokenService,
        },
      ],
    }).compile();

    service = module.get<GoogleDriveClientService>(GoogleDriveClientService);
  });

  afterEach(() => {
    service.onModuleDestroy();
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClient', () => {
    it('should throw UnauthorizedException when userId is empty', async () => {
      await expect(service.getClient('')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw NotFoundException when Google account does not exist', async () => {
      googleIntegrationService.findByUserId.mockResolvedValue(null);

      await expect(service.getClient('user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException when tokens are missing', async () => {
      googleIntegrationService.findByUserId.mockResolvedValue({
        accessToken: null,
        refreshToken: null,
      });

      await expect(service.getClient('user-123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create a Google Drive client successfully', async () => {
      googleIntegrationService.findByUserId.mockResolvedValue({
        accessToken: 'encrypted-access-token',
        refreshToken: 'encrypted-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const client = await service.getClient('user-123');

      expect(client).toBeDefined();
      expect(client.files).toBeDefined();

      expect(googleIntegrationService.findByUserId).toHaveBeenCalledTimes(1);

      expect(googleTokenService.decrypt).toHaveBeenCalledTimes(2);
    });

    it('should reuse cached client for the same user', async () => {
      googleIntegrationService.findByUserId.mockResolvedValue({
        accessToken: 'encrypted-access-token',
        refreshToken: 'encrypted-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const firstClient = await service.getClient('user-123');
      const secondClient = await service.getClient('user-123');

      expect(firstClient).toBe(secondClient);

      expect(googleIntegrationService.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should return the same client for concurrent requests', async () => {
      googleIntegrationService.findByUserId.mockResolvedValue({
        accessToken: 'encrypted-access-token',
        refreshToken: 'encrypted-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const [firstClient, secondClient] = await Promise.all([
        service.getClient('user-123'),
        service.getClient('user-123'),
      ]);

      expect(firstClient).toBe(secondClient);

      expect(googleIntegrationService.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalidateClient', () => {
    it('should remove cached client', async () => {
      googleIntegrationService.findByUserId.mockResolvedValue({
        accessToken: 'encrypted-access-token',
        refreshToken: 'encrypted-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
      });

      await service.getClient('user-123');

      service.invalidateClient('user-123');

      await service.getClient('user-123');

      expect(googleIntegrationService.findByUserId).toHaveBeenCalledTimes(2);
    });
  });

  describe('onModuleDestroy', () => {
    it('should clear cached clients', async () => {
      googleIntegrationService.findByUserId.mockResolvedValue({
        accessToken: 'encrypted-access-token',
        refreshToken: 'encrypted-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
      });

      await service.getClient('user-123');

      service.onModuleDestroy();

      await service.getClient('user-123');

      expect(googleIntegrationService.findByUserId).toHaveBeenCalledTimes(2);
    });
  });
});
