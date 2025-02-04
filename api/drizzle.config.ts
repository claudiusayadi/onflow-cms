import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './api/db/schema',
	dialect: 'postgresql',
	dbCredentials: {
		url: Bun.env.DB_URL!,
	},
});
