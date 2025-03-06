import { DEFAULT_PAGE_SIZE } from '../constants';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    skip = 0,
    take = DEFAULT_PAGE_SIZE,
  }: {
    skip?: number;
    take?: number;
  }) {
    return await this.prisma.post.findMany({
      include: {
        author: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },

      skip,
      take,
    });
  }

  async count() {
    return await this.prisma.post.count();
  }

  async findOne(id: string) {
    return await this.prisma.post.findFirst({
      where: { id },
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async findOneBySlug(slug: string) {
    return await this.prisma.post.findFirst({
      where: { slug },
      include: {
        author: true,
        tags: true,
      },
    });
  }
}
