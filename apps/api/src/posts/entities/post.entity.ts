import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Status } from '../../enums';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Like } from '../../likes/entities/like.entity';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => Status)
  published: Status;

  @Field()
  authorId: string;

  @Field(() => User)
  author: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => [Like], { nullable: true })
  likes?: Like[];
}
