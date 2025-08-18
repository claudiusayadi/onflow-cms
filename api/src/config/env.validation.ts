import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { z } from 'zod';

dotenvExpand.expand(dotenv.config());

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'staging'])
    .default('development'),
  API_PORT: z.coerce.number().min(1, 'API_PORT is required!'),
  API_BASEPATH: z.string().min(1, 'API_BASEPATH is required!'),

  DB_URL: z.string().min(1, 'DB_URL is required!'),

  JWT_SECRET: z.string().min(64, 'JWT_SECRET must be at least 64 characters!'),
  JWT_TTL: z.coerce.number().min(1, 'JWT_TTL is required!'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(64, 'JWT_REFRESH_SECRET must be at least 64 characters!'),
  JWT_REFRESH_TTL: z.coerce.number().min(1, 'JWT_REFRESH_TTL is required!'),

  THROTTLER_TTL: z.coerce.number().min(1, 'THROTTLER_TTL is required!'),
  THROTTLER_LIMIT: z.coerce.number().min(1, 'THROTTLER_LIMIT is required!'),

  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USERNAME: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_SENDER: z.string().optional(),

  SMTP_SERVER: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_LOGIN: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  APP_URL: z.string().optional(),
});

export type ApiConfig = z.infer<typeof envSchema>;

export const validateEnv = (): ApiConfig => {
  return envSchema.parse(process.env);
};

export const ApiConfig = validateEnv();
