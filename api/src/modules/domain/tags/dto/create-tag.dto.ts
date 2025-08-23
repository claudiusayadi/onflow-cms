import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  /**
   * Tag name
   * @example "nestjs"
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
