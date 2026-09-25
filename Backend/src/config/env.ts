import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_RIDER_EXPIRY: z.string().default('7d'),
  JWT_ADMIN_EXPIRY: z.string().default('24h'),
  JWT_BUYER_EXPIRY: z.string().default('24h'),
  MAPBOX_ACCESS_TOKEN: z.string().default(''),
  RAZORPAY_KEY_ID: z.string().default(''),
  RAZORPAY_KEY_SECRET: z.string().default(''),
  ALLOWED_ORIGINS: z.string().default('https://lmc-beige.vercel.app,https://lastmilecarbon.vercel.app,https://lastmilecarbon.app,*'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEMO_OTP: z.string().default('1234'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
