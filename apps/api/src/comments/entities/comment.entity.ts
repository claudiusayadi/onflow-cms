import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field()
  postId: string;

  @Field(() => User)
  author: User;

  @Field(() => Post)
  post: Post;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
