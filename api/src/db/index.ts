import { drizzle } from 'drizzle-orm/postgres-js';
import {pg}

const client = postgres(Bun.env.DB_URL!);
const db = drizzle({ client });

export default db;
