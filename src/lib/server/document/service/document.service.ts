import type { Context } from 'hono';
import { BaseService } from '@/core/base.service';
import { Service, ValidateDTO } from '@/core/decorators';
import type { Document } from '@/db';
import mime from '@/modules/mime';
import { CreateDocumentDto, UpdateDocumentDto } from '../dto/document.dto';
import { DocumentRepository } from '../repository/document.repository';

@Service()
export class DocumentService extends BaseService<
	Document,
	CreateDocumentDto,
	UpdateDocumentDto,
	DocumentRepository
> {
	constructor() {
		super(new DocumentRepository());
	}

	async loadAllComments(documentId: string) {
		return this.repository.loadAllComments(documentId);
	}

	async loadAllRevisions(documentId: string) {
		return this.repository.loadAllRevisions(documentId);
	}

	@ValidateDTO(CreateDocumentDto)
	override async create(
		dto: CreateDocumentDto,
		_context: Context,
	): Promise<Document> {
		return this.repository.create(dto);
	}

	async newDocument() {
		return this.repository.create({
			data: {},
			type: mime.getType('.html') || 'text/html',
			title: 'New Document',
		});
	}

	@ValidateDTO(UpdateDocumentDto)
	override async update(
		id: string | number,
		dto: UpdateDocumentDto,
		_context: Context,
	): Promise<Document[] | null> {
		return this.repository.update(id, dto);
	}
}
