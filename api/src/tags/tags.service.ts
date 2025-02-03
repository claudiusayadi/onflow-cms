import {
  Injectable,
  NotFoundException,
  Inject
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
import * as schema from './tags.schema';
import type {
  CreateTagDto,
  UpdateTagDto
} from './tags.dto';

@Injectable
export class TagsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase < typeof schema >,
  ) {}

  async create(name: string) {
    const existing = await this.db.query.tags.findFirst({
      where: eq(schema.tags.name, name),
    });
    if (existing) return existingTag;

    const docs = await this.db
    .insert(schema.tags)
    .values({
      name
    })
    .returning();
    return docs[0];
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