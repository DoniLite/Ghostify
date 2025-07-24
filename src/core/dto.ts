import { IsDate, IsOptional, IsString } from 'class-validator';

export abstract class BaseCreateDTO {
	@IsString()
	@IsOptional()
	id?: string;

	@IsDate()
	@IsOptional()
	createdAt?: Date;
}

export abstract class BaseUpdateDTO {
	@IsDate()
	@IsOptional()
	deletedAt?: Date;

	@IsDate()
	@IsOptional()
	updatedAt?: Date;
}
