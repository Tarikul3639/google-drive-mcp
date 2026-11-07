import { z } from 'zod';

export const validationSchema = z.object({
  PORT: z.coerce.number().default(5000),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: z
    .string({
      error: 'GOOGLE_CLIENT_ID is required',
    })
    .min(1, 'GOOGLE_CLIENT_ID cannot be empty'),

  GOOGLE_CLIENT_SECRET: z
    .string({
      error: 'GOOGLE_CLIENT_SECRET is required',
    })
    .min(1, 'GOOGLE_CLIENT_SECRET cannot be empty'),

  GOOGLE_CALLBACK_URL: z
    .string({
      error: 'GOOGLE_CALLBACK_URL is required',
    })
    .min(1, 'GOOGLE_CALLBACK_URL cannot be empty'),

  // Google Drive Integration Configuration
  GOOGLE_DRIVE_CALLBACK_URL: z
    .string({
      error: 'GOOGLE_DRIVE_CALLBACK_URL is required',
    })
    .min(1, 'GOOGLE_DRIVE_CALLBACK_URL cannot be empty'),

  GOOGLE_TOKEN_ENCRYPTION_KEY: z
    .string({
      error: 'GOOGLE_TOKEN_ENCRYPTION_KEY is required',
    })
    .regex(
      /^[0-9a-fA-F]{64}$/,
      'GOOGLE_TOKEN_ENCRYPTION_KEY must be a 64-character hexadecimal key.',
    ),

  DATABASE_URL: z
    .string({
      error: 'DATABASE_URL is required',
    })
    .min(1, 'DATABASE_URL cannot be empty'),

  REDIS_URL: z
    .string({
      error: 'REDIS_URL is required',
    })
    .min(1, 'REDIS_URL cannot be empty'),

  FRONTEND_URL: z
    .string({
      error: 'FRONTEND_URL is required',
    })
    .min(1, 'FRONTEND_URL cannot be empty'),

  JWT_SECRET: z
    .string({
      error: 'JWT_SECRET is required',
    })
    .min(1, 'JWT_SECRET cannot be empty'),

  SESSION_TTL: z
    .string({
      error: 'SESSION_TTL is required',
    })
    .min(1, 'SESSION_TTL cannot be empty'),

  SESSION_COOKIE_NAME: z
    .string({
      error: 'SESSION_COOKIE_NAME is required',
    })
    .min(1, 'SESSION_COOKIE_NAME cannot be empty'),

  // JWT Configuration
  JWT_ACCESS_SECRET: z
    .string({
      error: 'JWT_ACCESS_SECRET is required',
    })
    .min(1, 'JWT_ACCESS_SECRET cannot be empty'),

  JWT_ACCESS_TTL: z
    .string({
      error: 'JWT_ACCESS_TTL is required',
    })
    .min(1, 'JWT_ACCESS_TTL cannot be empty'),

  REFRESH_TOKEN_TTL: z
    .string({
      error: 'REFRESH_TOKEN_TTL is required',
    })
    .min(1, 'REFRESH_TOKEN_TTL cannot be empty'),

  // Cookie Names
  ACCESS_TOKEN_COOKIE_NAME: z
    .string({
      error: 'ACCESS_TOKEN_COOKIE_NAME is required',
    })
    .min(1, 'ACCESS_TOKEN_COOKIE_NAME cannot be empty'),

  REFRESH_TOKEN_COOKIE_NAME: z
    .string({
      error: 'REFRESH_TOKEN_COOKIE_NAME is required',
    })
    .min(1, 'REFRESH_TOKEN_COOKIE_NAME cannot be empty'),

  // MCP Configuration
  MCP_RESOURCE: z
    .string({
      error: 'MCP_RESOURCE is required',
    })
    .min(1, 'MCP_RESOURCE cannot be empty'),

  MCP_AUTHORIZATION_SERVER: z
    .string({
      error: 'MCP_AUTHORIZATION_SERVER is required',
    })
    .min(1, 'MCP_AUTHORIZATION_SERVER cannot be empty'),

  MCP_GOOGLE_CALLBACK_URL: z
    .string({
      error: 'MCP_GOOGLE_CALLBACK_URL is required',
    })
    .min(1, 'MCP_GOOGLE_CALLBACK_URL cannot be empty'),
});

export type EnvSchema = z.infer<typeof validationSchema>;
