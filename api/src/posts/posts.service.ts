import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.provider';
import * as schema from './posts.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createPostDto: typeof schema.posts.$inferInsert) {
    const existing = await this.db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.title, createPostDto.title))
      .limit(1);

    if (existing.length)
      throw new ConflictException(
        `Post with title ${createPostDto.title} already exists`,
      );

    return await this.db.insert(schema.posts).values(createPostDto).returning();
  }

  async findAll() {
    return await this.db.select().from(schema.posts);
  }

  async findOne(id: number) {
    const post = await this.db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id))
      .limit(1);

    if (!post.length) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post[0];
  }

  async update(id: number, updatePostDto: typeof schema.posts.$inferUpdate) {
    const updated = await this.db
      .update(schema.posts)
      .set(updatePostDto)
      .where(eq(schema.posts.id, id))
      .returning();

    if (!updated.length) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return updated[0];
  }

  async remove(id: number) {
    const deleted = await this.db
      .delete(schema.posts)
      .where(eq(schema.posts.id, id))
      .returning();

    if (!deleted.length) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return deleted[0];
  }
}
