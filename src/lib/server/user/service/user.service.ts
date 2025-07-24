import type { Context } from 'hono';
import { BaseService } from '@/core/base.service';
import { Service, ValidateDTO } from '@/core/decorators';
import type { User } from '@/db';
import { compareHash } from '@/utils/security/hash';
import { CreateUserDTO, type UpdateUserDTO } from '../dto/user.dto';
import { UserRepository } from '../repository/user.repository';
import { HTTPException } from 'hono/http-exception';

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

	@ValidateDTO(CreateUserDTO)
	async createUser(dto: CreateUserDTO, _context: Context): Promise<User> {
		const existingUser = await this.findByEmail(dto.email);
		if (existingUser) {
			throw new HTTPException(400, { message: 'User with this email already exists' });
		}

		if (dto.username) {
			const existingUsername = await this.findByUsername(dto.username);
			if (existingUsername) {
				throw new HTTPException(400, { message: 'Username already taken' });
			}
		}

		return this.create(dto, _context);
	}

	async login(login: string, password: string): Promise<User | null> {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const user = emailRegex.test(login)
			? await this.findByEmail(login)
			: await this.findByUsername(login);
		if (!user) {
			throw new HTTPException(404, { message: 'User not found' });
		}

		if (!user.password) {
			throw new HTTPException(400, { message: 'User does not have a password set' });
		}
		const isValid = await this.verifyPassword(password, user.password);
		if (!isValid) {
			throw new HTTPException(400, { message: 'Invalid password' });
		}

		return user;
	}

	async verifyPassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return compareHash(password, hashedPassword);
	}
}
