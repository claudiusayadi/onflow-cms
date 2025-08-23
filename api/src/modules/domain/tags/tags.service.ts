import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepo.create(dto);
    return this.tagsRepo.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagsRepo.find({ relations: { posts: true } });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagsRepo.findOne({
      where: { id },
      relations: { posts: true },
    });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(id: string, dto: UpdateTagDto): Promise<Tag> {
    await this.tagsRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagsRepo.remove(tag);
  }
}
