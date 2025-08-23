import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  /**
   * Comment content
   * @example "Great post! I learned a lot."
   */
  @IsString()
  @IsNotEmpty()
  content: string;

  /**
   * Parent comment ID (for replies comments)
   * @example "parent-comment-uuid"
   */
  @IsString()
  @IsOptional()
  parentId?: string;
}
