import { ArgsType, Field, Int } from '@nestjs/graphql';
import { SortField, SortOrder } from '../../enums';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

@ArgsType()
export class GetPostsArgs {
  @Field(() => Int, { defaultValue: 12 })
  @IsInt()
  @Min(1)
  limit?: number = 12;

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => SortField, { nullable: true })
  @IsOptional()
  @IsEnum(SortField)
  sortField?: SortField;

  @Field(() => SortOrder, { nullable: true })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
