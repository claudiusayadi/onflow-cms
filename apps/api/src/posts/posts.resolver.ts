import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { GetPostsArgs } from './dto/get-posts.args';
import { PostsResponse } from 'src/posts/dto/post-response.dto';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  async createPost(@Args('input') input: CreatePostInput) {
    return await this.postsService.createPost(input);
  }

  @Query(() => PostsResponse)
  async getPublishedPosts(@Args() args: GetPostsArgs) {
    return await this.postsService.getPublishedPosts(args);
  }

  @Query(() => PostsResponse)
  async getDashboardPosts(@Args() args: GetPostsArgs) {
    return await this.postsService.getDashboardPosts(args);
  }

  @Query(() => PostsResponse)
  async getTrashPosts(@Args() args: GetPostsArgs) {
    return await this.postsService.getTrashPosts(args);
  }
}
