import type { Context } from 'hono';
import type { BaseRepository } from './base.repository';
import { ValidateDTO } from './decorators';
import type { BaseEntity } from './types/base';

export abstract class BaseService<
	T extends BaseEntity,
	CreateDTO extends object,
	UpdateDTO extends object,
	Repository extends BaseRepository<T, CreateDTO, UpdateDTO>,
> {
	constructor(protected repository: Repository) {}
	/**
	 * Creates a new entity.
	 * @param dto - The data transfer object for creating the entity.
	 * @param _context - The Hono context, required for validation.
	 */
	@ValidateDTO()
	async create(dto: CreateDTO, _context: Context): Promise<T> {
		return this.repository.create(dto);
	}

	async findById(id: string | number): Promise<T | null> {
		return this.repository.findById(id);
	}

	async findAll(filters?: Partial<T>): Promise<T[]> {
		return this.repository.findAll(filters);
	}

	@ValidateDTO()
	async update(
		id: string | number,
		dto: UpdateDTO,
		_context: Context,
	): Promise<T[] | null> {
		const exists = await this.repository.exists(id);
		if (!exists) {
			throw new Error(`Entity with id ${id} not found`);
		}
		return this.repository.update(id, dto);
	}

	async delete(id: string | number): Promise<boolean> {
		const exists = await this.repository.exists(id);
		if (!exists) {
			throw new Error(`Entity with id ${id} not found`);
		}
		return this.repository.delete(id);
	}

	async findBy<V>(field: keyof T, value: V): Promise<T[]> {
		return this.repository.findBy(field, value);
	}

	async findOneBy<V>(field: keyof T, value: V): Promise<T | null> {
		return this.repository.findOneBy(field, value);
	}

	async count(filters?: Partial<T>): Promise<number> {
		return this.repository.count(filters);
	}

	async exists(id: string | number): Promise<boolean> {
		return this.repository.exists(id);
	}
}
