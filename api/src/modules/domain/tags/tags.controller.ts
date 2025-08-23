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
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiCreatedResponse({ description: 'Tag created successfully' })
  @HttpPost()
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ description: 'List of tags retrieved successfully' })
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiOkResponse({ description: 'Tag retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Tag not found' })
  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.tagsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update tag by ID' })
  @ApiOkResponse({ description: 'Tag updated successfully' })
  @ApiNotFoundResponse({ description: 'Tag not found' })
  @Patch(':id')
  update(@Param() { id }: IdDto, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete tag by ID' })
  @ApiOkResponse({ description: 'Tag deleted successfully' })
  @ApiNotFoundResponse({ description: 'Tag not found' })
  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.tagsService.remove(id);
  }
}
