import { DTO } from '@/core/decorators';
import { BaseCreateDTO, BaseUpdateDTO } from '@/core/dto';
import { IsObject, IsOptional, IsString } from 'class-validator';

@DTO()
export class CreateDocumentDto extends BaseCreateDTO {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	type!: string;

	@IsObject()
	@IsOptional()
	data?: Record<string | number, unknown>;

	@IsString()
	@IsOptional()
	userId?: string;
}

export class UpdateDocumentDto extends BaseUpdateDTO {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	type?: string;

	@IsString()
	@IsOptional()
	downLoadLink?: string;

    @IsObject()
    @IsOptional()
    data?: Record<string| number, unknown>;
}
