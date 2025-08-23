import { IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  /**
   * User ID
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @IsUUID()
  id: string;

  /**
   * Refresh Token
   * @example abcdefghijklmnopqrstuvwxyz1234567890
   */
  @IsString()
  refreshToken: string;
}
