import { z } from 'zod';

export const validationSchema = z.object({
  PORT: z.coerce.number().default(5000),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

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
});

export type EnvSchema = z.infer<typeof validationSchema>;
