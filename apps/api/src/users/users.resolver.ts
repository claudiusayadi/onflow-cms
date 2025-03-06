import { Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User, { name: 'createUser' })
  // async create(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return await this.usersService.create(createUserInput);
  // }
}
