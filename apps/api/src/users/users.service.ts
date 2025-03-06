import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    const { password, ...user } = createUserInput;
    const hashedPassword = await hash(password);

    try {
      return await this.prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          Array.isArray(error.meta?.target) &&
          error.meta.target.includes('email')
        ) {
          throw new Error('A user with this email already exists');
        }
      }
      throw error;
    }
  }
}
