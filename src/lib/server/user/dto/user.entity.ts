import {
	IsEmail,
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';
import { DTO } from '@/core/decorators';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';

@DTO()
export class CreateUserDTO extends BaseCreateDTO {
	@IsEmail({}, { message: 'Invalid provided email' })
	@IsNotEmpty({ message: 'Email is required.' })
	email!: string;

	@IsString()
	@IsOptional()
	fullname?: string;

	@IsString()
	@MinLength(8, {
		message: 'Password must be at least 8 characters long.',
	})
	password!: string;

	@IsIn(['User', 'Admin', 'Root'])
	@IsNotEmpty()
	permission!: 'User' | 'Admin' | 'Root';

	@IsOptional()
	apiAccess?: boolean;

	@IsString()
	@MinLength(3, {
		message: 'Username must be at least 3 characters long.',
	})
	@IsNotEmpty()
	@IsOptional()
	username?: string;
}

@DTO()
export class UpdateUserDTO extends BaseUpdateDTO {
	email?: string;
	fullname?: string;
	password?: string;
	apiAccess?: boolean;
	username?: string;
	bio?: string;
	link?: string;
}
