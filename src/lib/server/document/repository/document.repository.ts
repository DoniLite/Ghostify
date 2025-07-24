import { BaseRepository } from '@/core/base.repository';
import { Repository } from '@/core/decorators';
import { type Document, DocumentTable } from '@/db';
import type { CreateDocumentDto, UpdateDocumentDto } from '../dto/document.dto';
import { CommentRepository } from './comment.repository';
import { RevisionRepository } from './revision.repository';

@Repository('document')
export class DocumentRepository extends BaseRepository<
	Document,
	CreateDocumentDto,
	UpdateDocumentDto,
	typeof DocumentTable
> {
	protected table = DocumentTable;
	private revisionRepository;
	private commentRepository;

	constructor() {
		super();
		this.revisionRepository = new RevisionRepository();
		this.commentRepository = new CommentRepository();
	}

	async loadAllRevisions(documentId: string) {
		return this.revisionRepository.findAll({ documentId });
	}

	async loadAllComments(documentId: string) {
		return this.commentRepository.findAll({ documentId });
	}
}
