import { Resolver, Query, Context, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { Request } from 'express';
import { DEFAULT_PAGE_SIZE } from '../constants';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  async findAll(
    @Context() context: { req: Request },
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
    @Args('take', {
      type: () => Int,
      nullable: true,
      defaultValue: DEFAULT_PAGE_SIZE,
    })
    take: number,
  ) {
    const user = context.req.user;
    return await this.postsService.findAll({ skip, take });
  }

  @Query(() => Int, { name: 'postCount' })
  async count() {
    return await this.postsService.count();
  }

  @Query(() => Post, { name: 'getPostById' })
  async getPostById(
    @Args('id', { type: () => String, nullable: false }) id: string,
  ) {
    return await this.postsService.findOne(id);
  }

  @Query(() => Post, { name: 'getPostBySlug' })
  async getPostBySlug(
    @Args('slug', { type: () => String, nullable: false }) slug: string,
  ) {
    return await this.postsService.findOneBySlug(slug);
  }
}
