import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from 'src/constants';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPostComments(
    postId: string,
    skip: number = 0,
    take: number = DEFAULT_PAGE_SIZE,
  ) {
    return await this.prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async count(postId: string) {
    return await this.prisma.comment.count({
      where: {
        postId,
      },
    });
  }
}
