import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';

// decorators and enums from auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// dto
import { CreateTagDto } from './dtos/create.tag.dto';
import { UpdateTagDto } from './dtos/update.tag.dto';

// services
import { TagsService } from './services/tags.service';
import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';

@Controller('tags')
export class TagsController {
    constructor(
        @Inject()
        private readonly tagsService: TagsService,
    ) { }

    @ROLE(RoleEnum.ADMIN)
    @AUTH(AuthEnum.BEARER)
    @Get('one-tag/:tag_id')
    async getTagById(@Param('tag_id', ObjectIdValidationPipe) tag_id: string) {
        return {
            response: {
                tag: await this.tagsService.getTagById(tag_id),
            },
        };
    }

    @ROLE(RoleEnum.ADMIN)
    @AUTH(AuthEnum.BEARER)
    @Get('all-tags')
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
    @Patch('edit-tag/:tag_id')
    async editTag(
        @Param('tag_id', ObjectIdValidationPipe) tag_id: string,
        @Body() updateTagDto: UpdateTagDto,
    ) {
        const tag = await this.tagsService.getTagById(tag_id);
        if (!tag) {
            throw new NotFoundException({
                message: 'Tag not found',
                details: `Tag with id: ${tag_id} not found`,
            });
        }

        const updatedTag = await this.tagsService.updateTagById(tag, updateTagDto);

        return {
            response: {
                message: 'Tag updated successfully',
                tag: updatedTag,
            },
        };
    }

    @ROLE(RoleEnum.ADMIN)
    @AUTH(AuthEnum.BEARER)
    @Delete('tag/:tag_id')
    async deleteTag(@Param('tag_id', ObjectIdValidationPipe) tag_id: string) {
        const tag = await this.tagsService.getTagById(tag_id);
        if (!tag) {
            throw new ConflictException({
                message: 'Tag not found',
                details: `Tag with id: ${tag_id} not found`,
            });
        }

        await this.tagsService.deleteTagById(tag_id);

        return {
            response: {
                message: 'Tag deleted successfully',
            },
        };
    }
}
