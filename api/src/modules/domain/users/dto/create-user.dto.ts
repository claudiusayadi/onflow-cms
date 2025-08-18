import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../enums/user-roles.enum';

/**
 * Create user data
 */
export class CreateUserDto {
  /**
   * User first name
   * @example "John"
   */
  @IsString()
  @IsOptional()
  firstName?: string;

  /**
   * User last name
   * @example "Doe"
   */
  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Password must meet the following criteria:
   * - at least 8 characters long
   * - at least one lowercase letter
   * - at least one uppercase letter
   * - at least one number
   * - at least one symbol
   * @example "password123"
   */
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol.',
    },
  )
  password: string;

  /**
   * User avatar filename
   * @example "avatar.jpg"
   */
  @IsString()
  @IsOptional()
  avatar?: string;

  /**
   * User bio
   * @example "I love Arsenal FC!"
   */
  @IsString()
  @IsOptional()
  bio?: string;

  /**
   * User role
   * @example "reader"
   */
  @IsEnum(UserRole)
  role: UserRole;
}
