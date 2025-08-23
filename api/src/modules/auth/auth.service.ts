import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

import { ConfigType } from '@nestjs/config';
import { IPayload } from 'src/common/interfaces/payload.interface';
import jwtConfig from 'src/config/jwt.config';
import { ChangePasswordDto } from 'src/modules/auth/dto/change-password.dto';
import { User } from 'src/modules/domain/users/entities/user.entity';
import { UserRole } from 'src/modules/domain/users/enums/user-roles.enum';
import { IRequestUser } from 'src/modules/domain/users/interfaces/user.interface';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateLocal(dto: AuthDto) {
    const { email, password } = dto;
    const user = await this.usersRepo.findOne({
      where: { email },
      select: { id: true, password: true },
    });

    if (user && (await user.compare(password)))
      return this.createRequestUser(user);

    throw new UnauthorizedException('Invalid credential');
  }

  async validateJwt(payload: IPayload) {
    const user = await this.usersRepo.findOneBy({ id: payload.sub });
    if (!user) throw new UnauthorizedException('Invalid token');

    return this.createRequestUser(user);
  }

  async signin(user: IRequestUser) {
    const payload: IPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.signToken(
      payload,
      this.config.secret,
      this.config.signOptions.expiresIn,
    );
    const refreshToken = await this.signToken(
      payload,
      this.config.refreshSecret,
      this.config.refreshTtl,
    );

    await this.redisService.setRefreshToken(
      user.id,
      refreshToken,
      this.config.refreshTtl,
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const storedToken = await this.redisService.getRefreshToken(userId);

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const decoded = this.jwtService.verify<IPayload>(refreshToken, {
      secret: this.config.refreshSecret,
    });

    const payload: IPayload = {
      sub: decoded?.sub,
      email: decoded?.email,
      role: decoded?.role,
    };

    const newAccessToken = await this.signToken(
      payload,
      this.config.secret,
      this.config.signOptions.expiresIn,
    );
    const newRefreshToken = await this.signToken(
      payload,
      this.config.refreshSecret,
      this.config.refreshTtl,
    );

    await this.redisService.setRefreshToken(
      userId,
      newRefreshToken,
      this.config.refreshTtl,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async signout(userId: string) {
    await this.redisService.invalidateRefreshToken(userId);
  }

  async signup(dto: AuthDto) {
    const { email, password } = dto;
    const existing = await this.usersRepo.findOneBy({ email });

    if (existing) throw new ConflictException('Account already exists!');
    const user = this.usersRepo.create({ email, password });

    return await this.usersRepo.save(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const { newPassword, currentPassword } = dto;
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found!');

    if (!(await user.compare(currentPassword)))
      throw new UnauthorizedException('Invalid current password!');

    user.password = newPassword;
    await this.usersRepo.save(user);

    // Invalidate refresh token after password change
    await this.redisService.invalidateRefreshToken(id);

    return { message: 'Password changed successfully' };
  }

  async assignRole(id: string, role: UserRole) {
    const user = await this.usersRepo.preload({ id, role });

    if (!user) throw new NotFoundException('User not found');

    return this.usersRepo.save(user);
  }

  private createRequestUser(user: User): IRequestUser {
    const { id, email, role } = user;
    return { id, email, role };
  }

  private async signToken(
    payload: IPayload,
    secret: string,
    expiresIn: number,
  ) {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
