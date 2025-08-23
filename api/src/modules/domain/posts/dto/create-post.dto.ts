import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  /**
   * Post title
   * @example "How to use NestJS with TypeORM"
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Post content (markdown or HTML)
   * @example "This is a guide to using NestJS with TypeORM..."
   */
  @IsString()
  @IsNotEmpty()
  content: string;

  /**
   * List of tag IDs to associate with the post
   * @example ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]
   */
  @IsArray()
  @IsOptional()
  tagIds?: string[];
}
