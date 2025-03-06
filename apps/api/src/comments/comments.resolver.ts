import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { DEFAULT_LIMIT } from '../constants';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [Comment], { name: 'postComments' })
  async getPostComments(
    @Args('postId', { type: () => String, nullable: false }) postId: string,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
    @Args('take', {
      type: () => Int,
      nullable: true,
      defaultValue: DEFAULT_LIMIT,
    })
    take: number,
  ) {
    return await this.commentsService.getPostComments(postId, skip, take);
  }

  @Query(() => Int, { name: 'postCommentsCount' })
  async count(
    @Args('postId', { type: () => String, nullable: false }) postId: string,
  ) {
    return await this.commentsService.count(postId);
  }
}
