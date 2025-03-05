import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

// decorators and enums from auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

// dto
import { CreateTagDto } from './dtos/create.tag.dto';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// services
import { TagsService } from './services/tags.service';

@Controller('tags')
export class TagsController {
  constructor(
    @Inject()
    private readonly tagsService: TagsService,
  ) {}

  @ROLE(RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Get('all-tags-with-details')
  async getAllTagsWithDetails() {
    const tags = await this.tagsService.getAllTags();
    return {
      response: {
        tags,
      },
    };
  }

  @ROLE(RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('new-tag')
  async createTag(
    @Body() createTagDto: CreateTagDto,
    @ExtractAccountData('id') admin_id: number,
  ) {
    const tagExists = await this.tagsService.getOneTageByThree({
      category: createTagDto.category,
      subcategory: createTagDto.subcategory,
      tag: createTagDto.tag,
    });
    if (tagExists) {
      throw new ConflictException({
        message: 'Tag already exists',
        details: `Tag with category: ${createTagDto.category}, subcategory: ${createTagDto.subcategory}, tag: ${createTagDto.tag} already exists`,
      });
    }

    const tag = await this.tagsService.createNewTage(createTagDto, admin_id);

    return {
      response: {
        message: 'Tag created successfully',
        tag,
      },
    };
  }

  @ROLE(RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Delete('tag/:tagId')
  async deleteTag(@Param('tagId', ParseIntPipe) tagId: number) {
    const tag = await this.tagsService.getTagById(tagId);
    if (!tag) {
      throw new ConflictException({
        message: 'Tag not found',
        details: `Tag with id: ${tagId} not found`,
      });
    }

    await this.tagsService.deleteTagById(tagId);

    return {
      response: {
        message: 'Tag deleted successfully',
      },
    };
  }
}
