import { Body, Controller, Get, Inject, Post, ConflictException } from '@nestjs/common';

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
  @Post('new-tag')
  async createTag(
    @Body() createTagDto: CreateTagDto,
    @ExtractAccountData('id') admin_id: number,
  ) {
    const tagExists = await this.tagsService.getOneTageByThree({
      category: createTagDto.category,
      subcategory: createTagDto.subcategory,
      tag: createTagDto.tag,
    })
    if(tagExists) {
      throw new ConflictException({
        message: 'Tag already exists',
        details: `Tag with category: ${createTagDto.category}, subcategory: ${createTagDto.subcategory}, tag: ${createTagDto.tag} already exists`,
      })
    }

    const tag = await this.tagsService.createNewTage(createTagDto, admin_id);

    return {
      response: {
        message: 'Tag created successfully',
        tag,
      },
    };
  }

  @Get('all-tags')
  async getAllTags() {}

  @Get('categories')
  async getCategories() {}

  @Get('subcategories')
  async getSubcategories() {}

  @Get('tags')
  async getTags() {}
}
