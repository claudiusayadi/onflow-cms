import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '@/config';
import { Pool } from 'pg';

const client = new Pool({
	connectionString: env.DATABASE_URL,
});
const db = drizzle({ client });

export default db;
