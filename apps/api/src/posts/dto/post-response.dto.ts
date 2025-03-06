import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostsResponse {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  pages: number;

  @Field(() => Int)
  currentPage: number;
}
