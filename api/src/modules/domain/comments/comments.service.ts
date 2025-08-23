import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(
    dto: CreateCommentDto & { postId: string; authorId: string },
  ): Promise<Comment> {
    const post = await this.postsRepo.findOne({ where: { id: dto.postId } });
    if (!post) throw new NotFoundException('Post not found');

    const author = await this.usersRepo.findOne({
      where: { id: dto.authorId },
    });
    if (!author) throw new NotFoundException('Author not found');

    let parent: Comment | undefined = undefined;
    if (dto.parentId) {
      const foundParent = await this.commentsRepo.findOne({
        where: { id: dto.parentId },
      });

      if (!foundParent) throw new NotFoundException('Parent comment not found');
      parent = foundParent;
    }

    const comment = this.commentsRepo.create({
      content: dto.content,
      post,
      author,
      parent,
    });

    return this.commentsRepo.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepo.find({
      relations: { author: true, post: true, parent: true, children: true },
      order: { registryDates: { createdAt: 'ASC' } },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepo.findOne({
      where: { id },
      relations: { author: true, post: true, parent: true, children: true },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    await this.commentsRepo.update(id, { content: dto.content });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentsRepo.remove(comment);
  }
}
