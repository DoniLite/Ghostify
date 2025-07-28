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
	@IsNotEmpty()
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
	@IsOptional()
	username?: string;
}

@DTO()
export class UpdateUserDTO extends BaseUpdateDTO {
	@IsEmail({}, { message: 'Invalid provided email' })
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	fullname?: string;

	@IsString()
	@MinLength(8, {
		message: 'Password must be at least 8 characters long.',
	})
	@IsOptional()
	password?: string;

	@IsOptional()
	apiAccess?: boolean;

	@IsString()
	@MinLength(3, {
		message: 'Username must be at least 3 characters long.',
	})
	@IsOptional()
	username?: string;

	@IsString()
	@IsOptional()
	bio?: string;

	@IsString()
	@IsOptional()
	link?: string;
}
