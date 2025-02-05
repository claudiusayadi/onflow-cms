import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

async function dropAllTables() {
	// Initialize the PostgreSQL connection pool
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL, // Ensure DATABASE_URL is set in your environment variables
	});

	// Initialize Drizzle ORM with the pool
	const db = drizzle(pool);

	try {
		// Fetch all table names from the information_schema
		const tables = await db.execute<{ table_name: string }>(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

		// Drop each table
		for (const { table_name } of tables.rows) {
			console.log(`Dropping table: ${table_name}`);
			await db.execute(`DROP TABLE IF EXISTS "${table_name}" CASCADE`);
		}

		console.log('All tables dropped successfully.');
	} catch (error) {
		console.error('Error dropping tables:', error);
	} finally {
		// Close the database connection
		await pool.end();
	}
}

// Run the script
dropAllTables();
