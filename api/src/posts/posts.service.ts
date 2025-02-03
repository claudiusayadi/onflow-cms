import { Injectable, NotFoundException, Inject, ConflictException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.provider';
import * as schema from './posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(postData: typeof schema.posts.$inferInsert) {
    const existing = await this.db.query.posts.findFirst({
      where: eq(schema.posts.title, postData.title),
    });

    if (existing) {
      throw new ConflictException('A post with this title already exists');
    }

    const doc = await this.db
      .insert(schema.posts)
      .values(postData)
      .returning();

    return doc[0];
  }

  async findAll() {
    return await this.db.query.posts.findMany({
      with: {
        author: true,
        tags: true,
        comments: true,
      },
    });
  }

  async findOne(id: string) {
    const post = await this.db.query.posts.findFirst({
      where: eq(schema.posts.id, id),
      with: {
        author: true,
        tags: true,
        comments: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: string, updateData: typeof schema.posts.$inferInsert) {
    const existingPost = await this.db.query.posts.findFirst({
      where: eq(schema.posts.title, updateData.title),
    });

    if (existingPost && existingPost.id !== id) {
      throw new ConflictException('A post with this title already exists');
    }

    const updatedPosts = await this.db
      .update(schema.posts)
      .set(updateData)
      .where(eq(schema.posts.id, id))
      .returning();

    if (!updatedPosts.length) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return updatedPosts[0];
  }

  async remove(id: string) {
    const deletedPosts = await this.db
      .delete(schema.posts)
      .where(eq(schema.posts.id, id))
      .returning();

    if (!deletedPosts.length) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return deletedPosts[0];
  }
}