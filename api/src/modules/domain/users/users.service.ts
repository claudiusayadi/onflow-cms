import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from 'src/modules/auth/dto/auth.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepo.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.usersRepo.update(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      avatar: dto.avatar,
      bio: dto.bio,
    });

    return this.findOne(id);
  }

  async remove(id: string, soft: boolean) {
    if (!soft)
      throw new ForbiddenException(
        'You are not allowed to perform this action!',
      );

    const user = await this.findOne(id);
    return soft ? this.usersRepo.softRemove(user) : this.usersRepo.remove(user);
  }

  async recover(dto: AuthDto): Promise<User> {
    const { email, password } = dto;
    const user = await this.usersRepo.findOne({
      where: { email },
      withDeleted: true,
    });

    if (!user || !(await user.compare(password)))
      throw new UnauthorizedException('Invalid credential');

    if (!user.isDeleted) throw new ConflictException('User not deleted!');

    return await this.usersRepo.recover(user);
  }
}
