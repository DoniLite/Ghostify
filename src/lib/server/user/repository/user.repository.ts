import { BaseRepository } from "@/core/base.repository";
import { Repository } from "@/core/decorators";
import { UserTable, type User } from "@/db";
import type { CreateUserDTO, UpdateUserDTO } from "../dto/user.entity";

@Repository('user')
export class UserRepository extends BaseRepository<
	User,
	CreateUserDTO,
	UpdateUserDTO
> {
	protected table = UserTable;

	async findByEmail(email: string): Promise<User | null> {
		return this.findOneBy('email', email);
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.findOneBy('username', username);
	}
}