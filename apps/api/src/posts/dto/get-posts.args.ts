import { ArgsType, Field, Int } from '@nestjs/graphql';
import { SortField, SortOrder } from '../../enums';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../constants';

@ArgsType()
export class GetPostsArgs {
  @Field(() => Int, { defaultValue: DEFAULT_LIMIT })
  @IsInt()
  @Min(1)
  limit?: number = DEFAULT_LIMIT;

  @Field(() => Int, { defaultValue: DEFAULT_PAGE })
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @Field(() => SortField, { nullable: true })
  @IsOptional()
  @IsEnum(SortField)
  sortField?: SortField;

  @Field(() => SortOrder, { nullable: true })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
