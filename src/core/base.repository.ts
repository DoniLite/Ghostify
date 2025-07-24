/** biome-ignore-all lint/suspicious/noExplicitAny: Type inference for all the any definition isn't applicable with an easy way */
import { and, eq } from 'drizzle-orm';
import type {
	PgInsertValue,
	PgTable,
	PgTableWithColumns,
	PgUpdateSetSource,
} from 'drizzle-orm/pg-core';
import { DatabaseConnection } from './database';
import type { BaseEntity, BaseTable, CrudOperations } from './types/base';

export abstract class BaseRepository<
	T extends BaseEntity,
	CreateDTO extends PgInsertValue<Tb>,
	UpdateDTO extends PgUpdateSetSource<Tb>,
	Tb extends PgTableWithColumns<BaseTable> = PgTableWithColumns<BaseTable>,
> implements CrudOperations<T, CreateDTO, UpdateDTO>
{
	protected db = DatabaseConnection.getInstance().getDatabase();
	protected abstract table: Tb;

	async create(dto: CreateDTO): Promise<T> {
		const [result] = await this.db.insert(this.table).values(dto).returning();
		return result as unknown as T;
	}

	async findById(id: string | number): Promise<T | null> {
		const [result] = await this.db
			.select()
			.from(this.table as PgTable)
			.where(eq(this.table.id, id))
			.limit(1);
		return (result as T) || null;
	}

	async findAll(filters?: Partial<T>): Promise<T[]> {
		const query = this.db.select().from(this.table as PgTable);

		if (filters) {
			const conditions = Object.entries(filters)
				.filter(([_, value]) => value !== undefined)
				.map(([key, value]) => eq((this.table as any)[key], value));

			if (conditions.length > 0) {
				const filteredQuery = query.where(and(...conditions));
				return filteredQuery as Promise<T[]>;
			}
		}

		return query as Promise<T[]>;
	}

	async findOne(filters?: Partial<T>): Promise<T> {
		const query = this.db.select().from(this.table as PgTable);

		if (filters) {
			const conditions = Object.entries(filters)
				.filter(([_, value]) => value !== undefined)
				.map(([key, value]) => eq((this.table as any)[key], value));

			if (conditions.length > 0) {
				const [result] = await query.where(and(...conditions)).limit(1);
				return result as T;
			}
		}

		const [queryResult] = await query;

		return queryResult as T;
	}

	async update(id: string | number, dto: UpdateDTO): Promise<T[] | null> {
		const result = await this.db
			.update(this.table)
			.set(dto)
			.where(eq(this.table.id, id))
			.returning();
		return (result as T[]) || null;
	}

	async delete(id: string | number): Promise<boolean> {
		const result = await this.db
			.delete(this.table)
			.where(eq(this.table.id, id));
		return result.rowCount ? result.rowCount > 0 : true;
	}

	async findBy<V>(field: keyof T, value: V): Promise<T[]> {
		return this.db
			.select()
			.from(this.table as PgTable)
			.where(eq((this.table as any)[field], value)) as Promise<T[]>;
	}

	async findOneBy<V>(field: keyof T, value: V): Promise<T | null> {
		const [result] = await this.db
			.select()
			.from(this.table as PgTable)
			.where(eq((this.table as any)[field], value))
			.limit(1);
		return (result as T) || null;
	}

	async count(filters?: Partial<T>): Promise<number> {
		const query = this.db.select().from(this.table as PgTable);

		if (filters) {
			const conditions = Object.entries(filters)
				.filter(([_, value]) => value !== undefined)
				.map(([key, value]) => eq((this.table as any)[key], value));

			if (conditions.length > 0) {
				const filteredQuery = await query.where(and(...conditions));
				return filteredQuery.length;
			}
		}

		const result = await query;
		return result.length;
	}

	async exists(id: string | number): Promise<boolean> {
		const result = await this.findById(id);
		return result !== null;
	}
}
