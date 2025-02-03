import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../db/db.provider';
import * as schema from './users.schema';
import type { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, createUserDto.email));

    if (existing.length > 0) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const insertedUsers = await this.db
      .insert(schema.users)
      .values({
        email: createUserDto.email,
        password: createUserDto.password,
        role: createUserDto.role,
      })
      .returning();

    const user = insertedUsers[0];

    if (createUserDto.profile) {
      await this.db.insert(schema.profile).values({
        userId: user.id,
        username: createUserDto.profile.username,
        firstName: createUserDto.profile.firstName,
        lastName: createUserDto.profile.lastName,
        about: createUserDto.profile.about ?? null,
      });
    }
    return user;
  }

  async findAll() {
    return await this.db.select().from(schema.users);
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));

    if (!result || result.length === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result[0];
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUsers = await this.db
      .update(schema.users)
      .set({
        email: updateUserDto.email,
        password: updateUserDto.password,
        role: updateUserDto.role,
      })
      .where(eq(schema.users.id, id))
      .returning();

    if (!updatedUsers || updatedUsers.length === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.profile) {
      await this.db
        .update(schema.profile)
        .set({
          username: updateUserDto.profile.username,
          firstName: updateUserDto.profile.firstName,
          lastName: updateUserDto.profile.lastName,
          about: updateUserDto.profile.about ?? null,
        })
        .where(eq(schema.profile.userId, id));
    }
    return updatedUsers[0];
  }

  async remove(id: string) {
    const deleted = await this.db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deleted[0];
  }
}
