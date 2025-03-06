import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInInput } from './dto/sign-in.input';
import { PrismaService } from '../prisma/prisma.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { User } from '@prisma/client';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateLocalUser({ email, password }: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verify(user.password, password))) {
      throw new UnauthorizedException(
        'Login failed, please double check your email and password.',
      );
    }

    return user;
  }

  async generateToken(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async login(user: User) {
    const { accessToken } = await this.generateToken(user.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      accessToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('User not found!');

    const currentUser = { id: user.id };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    const dbUser = await this.prisma.user.create({
      data: {
        ...googleUser,
      },
    });

    const { password, ...result } = dbUser;
    return result;
  }
}
