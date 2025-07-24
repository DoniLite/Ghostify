import { IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { DTO } from '@/core/decorators';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';

@DTO()
export class CreateDocumentDto extends BaseCreateDTO {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString({ message: 'You must provide the document mime type' })
	type!: string;

	@IsObject({
		message: 'The document data must be a valid key -> value object',
	})
	@IsOptional()
	data?: Record<string | number, unknown>;

	@IsString()
	@IsOptional()
	userId?: string;
}

@DTO()
export class UpdateDocumentDto extends BaseUpdateDTO {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString({ message: 'You must provide the document mime type' })
	@IsOptional()
	type?: string;

	@IsUrl()
	@IsOptional()
	downLoadLink?: string;

	@IsObject({
		message: 'The document data must be a valid key -> value object',
	})
	@IsOptional()
	data?: Record<string | number, unknown>;
}
