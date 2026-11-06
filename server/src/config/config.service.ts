import { Injectable } from '@nestjs/common';
import { ConfigService as config } from '@nestjs/config';
import { EnvSchema } from './env.schema.js';
import ms, { type StringValue } from 'ms';

@Injectable()
export class ConfigService {
  constructor(
    private readonly config: config<EnvSchema, true>,
  ) { }

  // Application Configuration
  // NOTE: infer: true is used to ensure that the value is inferred as the correct type from the schema
  get port(): number {
    return this.config.get('PORT', { infer: true });
  }

  get nodeEnv(): EnvSchema['NODE_ENV'] {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  // Google OAuth Configuration

  get googleClientId(): string {
    return this.config.get('GOOGLE_CLIENT_ID', {
      infer: true,
    });
  }

  get googleClientSecret(): string {
    return this.config.get('GOOGLE_CLIENT_SECRET', {
      infer: true,
    });
  }

  get googleCallbackUrl(): string {
    return this.config.get('GOOGLE_CALLBACK_URL', {
      infer: true,
    });
  }

  get googleDriveCallbackUrl(): string {
    return this.config.get<string>('GOOGLE_DRIVE_CALLBACK_URL', {
      infer: true,
    });
  }

  get googleTokenEncryptionKey(): string {
    return this.config.get<string>(
      'GOOGLE_TOKEN_ENCRYPTION_KEY',
    )!;
  }

  // Database Configuration

  get databaseUrl(): string {
    return this.config.get('DATABASE_URL', {
      infer: true,
    });
  }

  // Redis Configuration

  get redisUrl(): string {
    return this.config.get('REDIS_URL', {
      infer: true,
    });
  }

  // Session Configuration

  get sessionTtlMs(): number {
    const ttl = ms(
      this.config.get('SESSION_TTL', {
        infer: true,
      }) as StringValue,
    );

    if (ttl === undefined || ttl <= 0) {
      throw new Error('Invalid SESSION_TTL configuration');
    }

    return ttl;
  }

  // JWT Configuration

  get jwtAccessSecret(): string {
    return this.config.get('JWT_ACCESS_SECRET', {
      infer: true,
    });
  }

  get jwtAccessTtlMs(): number {
    const ttl = ms(
      this.config.get('JWT_ACCESS_TTL', {
        infer: true,
      }) as StringValue,
    );

    if (ttl === undefined || ttl <= 0) {
      throw new Error('Invalid JWT_ACCESS_TTL configuration');
    }

    return ttl;
  }

  get refreshTokenTtlMs(): number {
    const ttl = ms(
      this.config.get('REFRESH_TOKEN_TTL', {
        infer: true,
      }) as StringValue,
    );

    if (ttl === undefined || ttl <= 0) {
      throw new Error('Invalid REFRESH_TOKEN_TTL configuration');
    }

    return ttl;
  }

  // Session Cookie Configuration
  get sessionCookieName(): string {
    return this.config.get('SESSION_COOKIE_NAME', {
      infer: true,
    });
  }

  // Frontend Configuration

  get frontendUrl(): string {
    return this.config.get('FRONTEND_URL', {
      infer: true,
    });
  }

  // Authentication Configuration

  get jwtSecret(): string {
    return this.config.get('JWT_SECRET', {
      infer: true,
    });
  }

  // Cookie Names
  get accessTokenCookieName(): string {
    return this.config.get('ACCESS_TOKEN_COOKIE_NAME', {
      infer: true,
    });
  }

  get refreshTokenCookieName(): string {
    return this.config.get('REFRESH_TOKEN_COOKIE_NAME', {
      infer: true,
    });
  }
}
