import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => Post)
  post: Post;

  @Field(() => User)
  author: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
