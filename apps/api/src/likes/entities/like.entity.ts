import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Like {
  @Field(() => ID)
  id: string;

  @Field(() => Post)
  post: Post;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;
}
