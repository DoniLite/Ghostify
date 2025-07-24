import { BaseRepository } from '@/core/base.repository';
import { DocumentRevisionTable, type Revision } from '@/db';
import type { CreateRevisionDto, UpdateRevisionDto } from '../dto/revision.dto';

export class RevisionRepository extends BaseRepository<
	Revision,
	CreateRevisionDto,
	UpdateRevisionDto,
	typeof DocumentRevisionTable
> {
	protected table = DocumentRevisionTable;
}
