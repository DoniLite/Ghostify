import { BaseService } from '@/core/base.service';
import type { Document } from '@/db';
import type { CreateDocumentDto, UpdateDocumentDto } from '../dto/document.dto';
import { DocumentRepository } from '../repository/document.repository';
import { Service } from '@/core/decorators';

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
}
