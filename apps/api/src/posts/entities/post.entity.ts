import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Comment } from '../../comments/entities/comment.entity';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  slug: string;

  @Field({ nullable: true })
  thumbnail: string;

  @Field(() => Boolean)
  published: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  author: User;

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @Field(() => [Like], { nullable: true })
  likes: Like[];

  @Field(() => [Tag], { nullable: true })
  tags: Tag[];
}
