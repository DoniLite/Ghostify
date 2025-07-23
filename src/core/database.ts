import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
// import * as schema from '../schema';

export class DatabaseConnection {
	private static instance: DatabaseConnection;
	private db: ReturnType<typeof drizzle>;

	private constructor() {
		const pool = new Pool({
			connectionString: process.env.DATABASE_URL,
		});
		this.db = drizzle(pool, { schema: {} });
	}

	static getInstance(): DatabaseConnection {
		if (!DatabaseConnection.instance) {
			DatabaseConnection.instance = new DatabaseConnection();
		}
		return DatabaseConnection.instance;
	}

	getDatabase() {
		return this.db;
	}
}
