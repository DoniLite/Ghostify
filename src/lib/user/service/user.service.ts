import { BaseService } from "@/core/base.service";
import { Service, ValidateDTO } from "@/core/decorators";
import type { User } from "@/db";
import type { CreateUserDTO, UpdateUserDTO } from "../dto/user.entity";
import { UserRepository } from "../repository/user.repository";
import type { Context } from "hono";

@Service()
export class UserService extends BaseService<
	User,
	CreateUserDTO,
	UpdateUserDTO,
	UserRepository
> {
	constructor() {
		super(new UserRepository());
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.repository.findByEmail(email);
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.repository.findByUsername(username);
	}

	@ValidateDTO()
	async createUser(dto: CreateUserDTO, _context: Context): Promise<User> {
		const existingUser = await this.findByEmail(dto.email);
		if (existingUser) {
			throw new Error('User with this email already exists');
		}

		if (dto.username) {
			const existingUsername = await this.findByUsername(dto.username);
			if (existingUsername) {
				throw new Error('Username already taken');
			}
		}

		return this.create(dto, _context);
	}
}