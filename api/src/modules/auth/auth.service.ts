import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IPayload } from 'src/common/interfaces/payload.interface';
import { ChangePasswordDto } from 'src/modules/auth/dto/change-password.dto';
import { User } from 'src/modules/domain/users/entities/user.entity';
import { UserRole } from 'src/modules/domain/users/enums/user-roles.enum';
import { IRequestUser } from 'src/modules/domain/users/interfaces/user.interface';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
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

    // if (user.changedPasswordAfter(payload.iat))
    //   throw new UnauthorizedException('User recently changed password!');

    return this.createRequestUser(user);
  }

  signin(user: IRequestUser) {
    const payload = { sub: user.id } as IPayload;
    return this.jwtService.sign(payload);
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
    const user = await this.usersRepo.preload({
      id,
      password: newPassword,
    });

    if (!user) throw new NotFoundException('User not found!');

    if (!(await user.compare(currentPassword)))
      throw new UnauthorizedException('Invalid current password!');

    return this.usersRepo.save(user);
  }

  async assignRole(id: string, role: UserRole) {
    const user = await this.usersRepo.preload({
      id,
      role,
    });

    if (!user) throw new NotFoundException('User not found');

    return this.usersRepo.save(user);
  }

  private createRequestUser(user: User): IRequestUser {
    const { id, email, role } = user;
    return { id, email, role };
  }
}
