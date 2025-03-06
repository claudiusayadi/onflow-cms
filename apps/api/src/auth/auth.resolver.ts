import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './entities/auth-payload.entity';
import { SignInInput } from './dto/sign-in.input';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';
import { UsersService } from '../users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => User, { name: 'signup' })
  async signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => AuthPayload, { name: 'signin' })
  async signin(@Args('signInInput') signInInput: SignInInput) {
    const user = await this.authService.validateLocalUser(signInInput);
    return this.authService.login(user);
  }
}
