import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  role?: 'reader' | 'writer' | 'editor' | 'admin';
}
