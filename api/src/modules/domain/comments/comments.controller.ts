import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IdDto } from 'src/common/dto/id.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Create a comment. Requires postId and authorId in body for context.
   */

  @ApiOperation({ summary: 'Create a new comment (threaded)' })
  @ApiCreatedResponse({ description: 'Comment created successfully' })
  @HttpPost()
  create(@Body() dto: CreateCommentDto & { postId: string; authorId: string }) {
    return this.commentsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse({ description: 'List of comments retrieved successfully' })
  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiOkResponse({ description: 'Comment retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.commentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update comment by ID' })
  @ApiOkResponse({ description: 'Comment updated successfully' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @Patch(':id')
  update(@Param() { id }: IdDto, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete comment by ID' })
  @ApiOkResponse({ description: 'Comment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.commentsService.remove(id);
  }
}
