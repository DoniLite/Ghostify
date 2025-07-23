import { BaseRepository } from '@/core/base.repository';
import { type Document, DocumentTable } from '@/db';
import type { CreateDocumentDto, UpdateDocumentDto } from '../dto/document.dto';
import { Repository } from '@/core/decorators';

@Repository('document')
export class DocumentRepository extends BaseRepository<
	Document,
	CreateDocumentDto,
	UpdateDocumentDto,
	typeof DocumentTable
> {
	protected table = DocumentTable;
}
