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

// decorators and types from auth
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';
import { ExtractAccountData } from '@app/decorators';

// dto
import { CreateTagDto } from '../dtos/create.tag.dto';
import { UpdateTagDto } from '../dtos/update.tag.dto';

// services
import { TagsService } from '../services/tags.service';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('tags/admins')
export class TagsViaAdminsController {
    constructor(
        @Inject()
        private readonly tagsService: TagsService,
    ) {}

    @Get('one-tag/:tag_id')
    async getTagById(@Param('tag_id', ParseIntPipe) tag_id: number) {
        const tag = await this.tagsService.findOneTag(tag_id);
        if (!tag) {
            throw new NotFoundException({
                message: 'Tag not found',
                details: `Tag with id: ${tag_id} not found`,
            });
        }

        const creator_account = tag.tag_creator;
        const creator_profile = await creator_account.profile;
        delete tag.tag_creator;
        return {
            response: {
                message: 'Tag fetched successfully',
                tag,
                creator_account,
                creator_profile,
            },
        };
    }

    @Get('all-tags')
    async getAllTagsWithDetails() {
        const tags = await this.tagsService.findAllTags({});
        return {
            response: {
                message: 'all Tags fetched successfully',
                tags,
            },
        };
    }

    @Post('new-tag')
    async createTag(
        @Body() createTagDto: CreateTagDto,
        @ExtractAccountData('id') admin_id: number,
    ) {
        const tagExists = await this.tagsService.findOneTagWithAllFields({
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

        const tag = await this.tagsService.createTag(createTagDto, admin_id);

        return {
            response: {
                message: 'Tag created successfully',
                tag,
            },
        };
    }

    @Patch('edit-tag/:tag_id')
    async editTag(
        @Param('tag_id', ParseIntPipe) tag_id: number,
        @Body() updateTagDto: UpdateTagDto,
    ) {
        const tag = await this.tagsService.findOneTag(tag_id);
        if (!tag) {
            throw new NotFoundException({
                message: 'Tag not found',
                details: `Tag with id: ${tag_id} not found`,
            });
        }

        const updatedTag = await this.tagsService.updateTag(tag_id, updateTagDto);

        return {
            response: {
                message: 'Tag updated successfully',
                tag: updatedTag,
            },
        };
    }

    @Delete('tag/:tag_id')
    async deleteTag(@Param('tag_id', ParseIntPipe) tag_id: number) {
        const tag = await this.tagsService.findOneTag(tag_id);
        if (!tag) {
            throw new ConflictException({
                message: 'Tag not found',
                details: `Tag with id: ${tag_id} not found`,
            });
        }

        await this.tagsService.deleteTag(tag_id);

        return {
            response: {
                message: 'Tag deleted successfully',
            },
        };
    }
}
