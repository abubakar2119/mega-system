import dotenv from "dotenv"

import { z } from 'zod';


dotenv.config()

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().url(),

  REDIS_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
});


const parsed = EnvSchema.safeParse(process.env);


if (!parsed.success) {
  console.error(
    '✖ Invalid environment configuration',
    parsed.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const config = parsed.data;