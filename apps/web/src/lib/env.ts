import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  WORDPRESS_API_URL: z.string().url().default('https://slotstars.kestudio.sk/wp-json'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://slotstar.fun'),
});

function parseEnv() {
  const parsed = envSchema.safeParse({
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    } else {
      console.error('Invalid environment variables configuration.');
    }
    throw new Error('Application configuration error.');
  }

  return parsed.data;
}

export const env = parseEnv();
