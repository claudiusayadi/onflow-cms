import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.provider';
import * as schema from './tags.schema';
import type { CreateTagDto, UpdateTagDto } from './tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const existing = await this.db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, createTagDto.name));
    if (existing.length > 0) {
      throw new NotFoundException(
        `Tag with name ${createTagDto.name} already exists`,
      );
    }

    const inserted = await this.db
      .insert(schema.tags)
      .values({ name: createTagDto.name })
      .returning();

    return inserted[0];
  }

  async findAll() {
    return await this.db.select().from(schema.tags);
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.id, id));

    if (!result || result.length === 0) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const updated = await this.db
      .update(schema.tags)
      .set({ name: updateTagDto.name })
      .where(eq(schema.tags.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return updated[0];
  }

  async remove(id: string) {
    const deleted = await this.db
      .delete(schema.tags)
      .where(eq(schema.tags.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return deleted[0];
  }
}
