import { env } from '@/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
