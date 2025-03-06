import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar: string;

  @Field()
  accessToken: string;
}
