import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IdDto } from 'src/common/dto/id.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiCreatedResponse({ description: 'Post created successfully' })
  @Post()
  async create(@Body() dto: CreatePostDto) {
    return await this.postsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({ description: 'List of posts retrieved successfully' })
  @Get()
  async findAll() {
    return await this.postsService.findAll();
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @ApiOkResponse({ description: 'Post retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return await this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update post by ID' })
  @ApiOkResponse({ description: 'Post updated successfully' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() dto: UpdatePostDto) {
    return await this.postsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiOkResponse({ description: 'Post deleted successfully' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return await this.postsService.remove(id);
  }
}
