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
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IdDto } from 'src/common/dtos/id.dto';
import { RemoveDto } from 'src/common/dtos/remove.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { IRequestUser } from 'src/modules/domain/users/interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-roles.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user account (Admin only)' })
  @ApiCreatedResponse({ description: 'User account created successfully' })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  @ApiUnauthorizedResponse({ description: 'Admin access required' })
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Get all user accounts (Admin only)' })
  @ApiOkResponse({
    description: 'List of all user accounts retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Admin access required' })
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get current user profile (Owner only)' })
  @ApiOkResponse({ description: 'User profile retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('me')
  async getProfile(@CurrentUser() user: IRequestUser) {
    return await this.usersService.findOne(user.id);
  }

  @ApiOperation({ summary: 'Get user account by ID (Admin only)' })
  @ApiOkResponse({ description: 'User account retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Admin access required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getProfileById(@Param('id') { id }: IdDto) {
    return await this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update current user profile (Owner only)' })
  @ApiOkResponse({ description: 'User profile updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Patch('me')
  updateProfile(@CurrentUser() user: IRequestUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @ApiOperation({ summary: 'Update user account by ID (Admin only)' })
  @ApiOkResponse({ description: 'User account updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Admin access required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') { id }: IdDto, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Deactivate/Delete current user account (Owner only)',
  })
  @ApiOkResponse({
    description: 'User account deactivated/deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete('me')
  deactivate(@CurrentUser() user: IRequestUser, @Query() { soft }: RemoveDto) {
    return this.usersService.remove(user.id, soft ?? false);
  }

  @ApiOperation({
    summary: 'Deactivate/Delete user account by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'User account deactivated/deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Admin access required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') { id }: IdDto, @Query() { soft }: RemoveDto) {
    return this.usersService.remove(id, soft ?? false);
  }
}
