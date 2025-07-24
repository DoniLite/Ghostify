import { BaseRepository } from '@/core/base.repository';
import { type Comment, DocumentCommentTable } from '@/db';
import type { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';

export class CommentRepository extends BaseRepository<
	Comment,
	CreateCommentDto,
	UpdateCommentDto,
	typeof DocumentCommentTable
> {
	protected table = DocumentCommentTable;
}
