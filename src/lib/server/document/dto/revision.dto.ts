import { DTO } from '@/core/decorators';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';
import type { NewRevision } from '@/db';
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

@DTO()
export class CreateRevisionDto extends BaseCreateDTO {
	@IsString()
	@IsOptional()
	parentId?: string;

	@IsString({
		message: "The comment content can't be empty",
	})
	content!: string;

	@IsString({
		message: 'Provide a document node key to map with this comment',
	})
	nodeKey!: string;

	@IsBoolean({
		message: 'Provide a valid boolean value for this field',
	})
	resolved!: boolean;

	@IsEnum(['insert', 'format', 'delete'], {
		message:
			"The provided value don't satisfy the revision enum type -> | insert | format | delete",
	})
	type!: NewRevision['type'];
}

@DTO()
export class UpdateRevisionDto extends BaseUpdateDTO {
	@IsString()
	@IsOptional()
	content?: string;

	@IsBoolean({
		message: 'Provide a valid boolean value for this field',
	})
	@IsOptional()
	resolved?: boolean;
}
