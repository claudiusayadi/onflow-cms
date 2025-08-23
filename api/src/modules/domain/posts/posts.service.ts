import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(Tag) private readonly tagsRepo: Repository<Tag>,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postsRepo.create({
      title: dto.title,
      content: dto.content,
    });

    if (dto.tagIds && dto.tagIds.length)
      post.tags = await this.tagsRepo.findBy({ id: In(dto.tagIds) });

    return this.postsRepo.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepo.find({
      relations: { author: true, comments: true, tags: true },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepo.findOneOrFail({
      where: { id },
      relations: { author: true, comments: true, tags: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    await this.postsRepo.update(id, {
      title: dto.title,
      content: dto.content,
      tags: dto.tagIds
        ? await this.tagsRepo.findBy({ id: In(dto.tagIds) })
        : [],
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepo.remove(post);
  }
}
