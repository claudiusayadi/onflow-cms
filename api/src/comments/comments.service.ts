import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.provider';
import * as schema from './comments.schema';
import type { CreateCommentDto, UpdateCommentDto } from './comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const inserted = await this.db
      .insert(schema.comments)
      .values({
        content: createCommentDto.content,
        postId: createCommentDto.postId,
        authorId: createCommentDto.authorId,
      })
      .returning();
    return inserted[0];
  }

  async findAll() {
    return await this.db.select().from(schema.comments);
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.id, id));
    if (!result || result.length === 0) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const updated = await this.db
      .update(schema.comments)
      .set({
        content: updateCommentDto.content,
        postId: updateCommentDto.postId,
        authorId: updateCommentDto.authorId,
      })
      .where(eq(schema.comments.id, id))
      .returning();
    if (!updated || updated.length === 0) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return updated[0];
  }

  async remove(id: string) {
    const deleted = await this.db
      .delete(schema.comments)
      .where(eq(schema.comments.id, id))
      .returning();
    if (!deleted || deleted.length === 0) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return deleted[0];
  }
}
