import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as AdminSchema from '../db/schema/admin.schema';
import * as ContactSchema from '../db/schema/contact.schema';
import * as FundingSchema from '../db/schema/funding.schema';
import * as NotificationSchema from '../db/schema/notification.schema';
import * as Relations from '../db/schema/relations';
import * as ServiceSchema from '../db/schema/service.schema';
import * as UserSchema from '../db/schema/user.schema';
export class DatabaseConnection {
	private static instance: DatabaseConnection;
	private db;

	private constructor() {
		const pool = new Pool({
			connectionString: process.env.DATABASE_URL,
		});
		this.db = drizzle(pool, {
			schema: {
				...AdminSchema,
				...UserSchema,
				...ContactSchema,
				...FundingSchema,
				...NotificationSchema,
				...ServiceSchema,
				...Relations,
			},
		});
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
