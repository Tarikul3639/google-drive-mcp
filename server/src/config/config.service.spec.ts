import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService as AppConfigService } from '@nestjs/config';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from './config.service.js';

describe('ConfigService', () => {
  let service: ConfigService;

  const config: Record<string, unknown> = {
    PORT: 3000,
    NODE_ENV: 'development',
    GOOGLE_CLIENT_ID: 'test-client-id',
    GOOGLE_CLIENT_SECRET: 'test-client-secret',
    GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',
    DATABASE_URL: 'postgresql://localhost:5432/test',
    FRONTEND_URL: 'http://localhost:3001',
    JWT_SECRET: 'test-secret',
  };

  const mockConfigService = {
    get: vi.fn((key: string) => config[key]),
  };

  beforeEach(async () => {
    Object.assign(config, {
      PORT: 3000,
      NODE_ENV: 'development',
      GOOGLE_CLIENT_ID: 'test-client-id',
      GOOGLE_CLIENT_SECRET: 'test-client-secret',
      GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/callback',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      FRONTEND_URL: 'http://localhost:3001',
      JWT_SECRET: 'test-secret',
    });

    mockConfigService.get.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: AppConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Application Configuration

  it('should return the configured port', () => {
    expect(service.port).toBe(3000);
  });

  it('should return the configured node environment', () => {
    expect(service.nodeEnv).toBe('development');
  });

  it('should identify development environment', () => {
    expect(service.isDevelopment).toBe(true);
    expect(service.isProduction).toBe(false);
    expect(service.isTest).toBe(false);
  });

  it('should identify production environment', () => {
    config.NODE_ENV = 'production';

    expect(service.isProduction).toBe(true);
    expect(service.isDevelopment).toBe(false);
    expect(service.isTest).toBe(false);
  });

  it('should identify test environment', () => {
    config.NODE_ENV = 'test';

    expect(service.isTest).toBe(true);
    expect(service.isDevelopment).toBe(false);
    expect(service.isProduction).toBe(false);
  });

  // Google OAuth Configuration

  it('should return Google Client ID', () => {
    expect(service.googleClientId).toBe('test-client-id');
  });

  it('should return Google Client Secret', () => {
    expect(service.googleClientSecret).toBe('test-client-secret');
  });

  it('should return Google Callback URL', () => {
    expect(service.googleCallbackUrl).toBe(
      'http://localhost:3000/auth/google/callback',
    );
  });

  // Database Configuration

  it('should return database URL', () => {
    expect(service.databaseUrl).toBe(
      'postgresql://localhost:5432/test',
    );
  });

  // Frontend Configuration

  it('should return frontend URL', () => {
    expect(service.frontendUrl).toBe('http://localhost:3001');
  });

  // Authentication Configuration

  it('should return JWT secret', () => {
    expect(service.jwtSecret).toBe('test-secret');
  });
});
