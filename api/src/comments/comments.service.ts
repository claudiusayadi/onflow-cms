import {
  Injectable,
  Inject,
  NotFoundException
} from '@nestjs/common';
import {
  eq
} from 'drizzle-orm';
import {
  NodePgDatabase
} from 'drizzle-orm/node-postgres';
import {
  DRIZZLE
} from '../db/db.provider';
import * as schema from './comments.schema';
import type {
  CreateCommentDto,
  UpdateCommentDto
} from './comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase < typeof schema >,
  ) {}

  async create(createCommentDto: typeof schema.comments.$inferInsert) {
    const docs = await this.db
    .insert(schema.comments)
    .values(createCommentDto)
    .returning();

    return docs[0];
  }

  async findAll() {
    return await this.db.query.comments.findMany({
      with: {
        author: true,
        post: true
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.query.comments.findFirst({
      where: eq(schema.comments.id, id),
      with: {
        author: true, 
        post: true
      },
    });
    if (!result) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return result;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const updatedComments = await this.db
    .update(schema.comments)
    .set(updateCommentDto)
    .where(eq(schema.comments.id, id))
    .returning();
    if (!updatedComments.length) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return updatedComments[0];
  }

  async remove(id: string) {
    const deleted = await this.db
    .delete(schema.comments)
    .where(eq(schema.comments.id, id))
    .returning();
    if (!deleted.length) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return deleted[0];
  }
}

@Injectable()
export class TagsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase < typeof schema >,
  ) {}

  async create(name: string) {
    const existingTag = await this.db.query.tags.findFirst({
      where: eq(schema.tags.name, name),
    });
    if (existingTag) return existingTag;

    const insertedTags = await this.db
    .insert(schema.tags)
    .values({
      name
    })
    .returning();
    return insertedTags[0];
  }

  async findAll() {
    return await this.db.select().from(schema.tags);
  }

  async findOne(id: string) {
    const result = await this.db.query.tags.findFirst({
      where: eq(schema.tags.id, id),
    });
    if (!result) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return result;
  }

  async remove(id: string) {
    const deleted = await this.db
    .delete(schema.tags)
    .where(eq(schema.tags.id, id))
    .returning();
    if (!deleted.length) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return deleted[0];
  }
}