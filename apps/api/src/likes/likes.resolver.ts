import { Resolver } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';

@Resolver(() => Like)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}
}
