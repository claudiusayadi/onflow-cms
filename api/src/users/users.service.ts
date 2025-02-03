import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { hash } from 'bcrypt';
import { DRIZZLE } from '../db/db.provider';
import * as schema from './users.schema';
import type { UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createUserDto: typeof schema.users.$inferInsert) {
    const existing = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, createUserDto.email));

    if (existing.length > 0) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const hashedPassword = await hash(createUserDto.password as string, 12);

    const insertedUsers = await this.db
      .insert(schema.users)
      .values({
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      })
      .returning();
    const user = insertedUsers[0];

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async createProfile(
    userId: string,
    profileData: typeof schema.profile.$inferInsert,
  ) {
    const inserted = await this.db
      .insert(schema.profile)
      .values({
        userId,
        username: profileData.username,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        about: profileData.about ?? null,
      })
      .returning();
    return inserted[0];
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatePayload: Partial<(typeof schema.users)['__columns']> = {
      email: updateUserDto.email,
      role: updateUserDto.role,
    };
    if (updateUserDto.password) {
      updatePayload.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUsers = await this.db
      .update(schema.users)
      .set(updatePayload)
      .where(eq(schema.users.id, id))
      .returning();
    if (!updatedUsers || updatedUsers.length === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = updatedUsers[0];
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }

  async updateProfile(
    userId: string,
    profileData: typeof schema.profile.$inferInsert,
  ) {
    const updatedProfile = await this.db
      .update(schema.profile)
      .set({
        username: profileData.username,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        about: profileData.about ?? null,
      })
      .where(eq(schema.profile.userId, userId))
      .returning();

    if (!updatedProfile || updatedProfile.length === 0) {
      throw new NotFoundException(`Profile for user id ${userId} not found`);
    }

    return updatedProfile[0];
  }

  async findAll() {
    const users = await this.db.query.users.findMany({
      with: {
        profile: true,
        posts: true,
      },
    });

    const { password, ...safeUsers } = users;
    return safeUsers;
  }

  async findOne(id: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
      with: { profile: true, posts: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async remove(id: string) {
    const deleted = await this.db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const deletedUser = deleted[0];
    const { password, ...safeUser } = deletedUser;
    return safeUser;
  }
}
