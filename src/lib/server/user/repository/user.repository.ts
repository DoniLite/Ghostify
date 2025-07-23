import { BaseRepository } from '@/core/base.repository';
import { Repository } from '@/core/decorators';
import { type User, UserTable } from '@/db';
import type { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { DocumentRepository } from '../../document/repository/document.repository';

@Repository('user')
export class UserRepository extends BaseRepository<
	User,
	CreateUserDTO,
	UpdateUserDTO,
	typeof UserTable
> {
	protected table = UserTable;
	private documentRepository;

	constructor() {
		super();
		this.documentRepository = new DocumentRepository();
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.findOneBy('email', email);
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.findOneBy('username', username);
	}

	async findUserDocuments(id: string) {
		return this.documentRepository.findAll({ userId: id });
	}
}
