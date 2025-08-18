import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IdDto } from 'src/common/dtos/id.dto';
import { RemoveDto } from 'src/common/dtos/remove.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { IRequestUser } from 'src/modules/domain/users/interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-roles.enum';
import { UsersService } from './users.service';

@Controller('accounts')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user account (Admin only)
   * @example {firstName: "John", lastName: "Doe", email: "john@doe.com", password: "password123", avatar: "avatar.jpg", bio: "I love Arsenal FC!"}
   */
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  /**
   * Get all user accounts (Admin only)
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  /**
   * Get user account (Owner only)
   * @example {id: "1"}
   */
  @Get('me')
  async getProfile(@CurrentUser() user: IRequestUser) {
    return await this.usersService.findOne(user.id);
  }

  /**
   * Get user account (Admin only)
   * @example {id: "1"}
   */
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getProfileById(@Param('id') { id }: IdDto) {
    return await this.usersService.findOne(id);
  }

  /**
   * Update user account (Owner only)
   * @example {firstName: "John", lastName: "Doe", email: "john@doe.com", avatar: "avatar.jpg", bio: "I love loser FC now - Man U!"}
   */
  @Patch('me')
  updateProfile(@CurrentUser() user: IRequestUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  /**
   * Update user account (Admin only)
   * @example {firstName: "John", lastName: "Doe", email: "john@doe.com", avatar: "avatar.jpg", bio: "I love loser FC now - Man U!"}
   */
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') { id }: IdDto, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /**
   * Deactivate/Delete user account (Owner only)
   * @example {soft: true}
   */
  @Delete('me')
  deactivate(@CurrentUser() user: IRequestUser, @Query() { soft }: RemoveDto) {
    return this.usersService.remove(user.id, soft ?? false);
  }

  /**
   * Deactivate/Delete user account (Admin only)
   * @example {soft: true}
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') { id }: IdDto, @Query() { soft }: RemoveDto) {
    return this.usersService.remove(id, soft ?? false);
  }
}
