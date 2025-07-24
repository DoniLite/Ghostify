import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';

export class CreateCommentDto extends BaseCreateDTO {
	@IsString({
		message: 'Your comment have to contain some content',
	})
	content!: string;

	@IsString({
		message: 'Provide a valid document node key to map with this comment',
	})
	nodeKey!: string;

	@IsString()
	@IsOptional()
	documentId?: string;

	@IsString({
		message: 'The comment must be associated with any user',
	})
	authorId!: string;

	@IsString()
	@IsOptional()
	parentId?: string;

	@IsBoolean()
	@IsOptional()
	resolved?: boolean;
}

export class UpdateCommentDto extends BaseUpdateDTO {
	@IsString()
	@IsOptional()
	content?: string;

	@IsBoolean()
	@IsOptional()
	resolved?: boolean;
}
