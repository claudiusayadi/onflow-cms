import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { GetPostsArgs } from './dto/get-posts.args';
import { slugify } from '../utils';
import { Status, Prisma } from '@prisma/client';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(post: CreatePostInput) {
    const slug = slugify(post.title);
    return this.prisma.post.create({
      data: {
        ...post,
        slug,
      },
    });
  }
  private async getPostsByStatus(args: GetPostsArgs, statuses: Status[]) {
    const {
      limit = DEFAULT_LIMIT,
      page = DEFAULT_PAGE,
      sortField,
      sortOrder,
    } = args;
    const skip = (page - 1) * limit;

    const orderBy = sortField
      ? { [sortField]: sortOrder || Prisma.SortOrder.desc }
      : { createdAt: Prisma.SortOrder.desc };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { published: { in: statuses } },
        skip,
        take: limit,
        orderBy,
        include: { author: true, tags: true, comments: true, likes: true },
      }),
      this.prisma.post.count({ where: { published: { in: statuses } } }),
    ]);

    return {
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
  async getPublishedPosts(args: GetPostsArgs) {
    return this.getPostsByStatus(args, [Status.published]);
  }

  async getDashboardPosts(args: GetPostsArgs) {
    return this.getPostsByStatus(args, [Status.published, Status.draft]);
  }

  async getTrashPosts(args: GetPostsArgs) {
    return this.getPostsByStatus(args, [Status.deleted]);
  }
}
