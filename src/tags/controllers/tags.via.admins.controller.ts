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

    @Get('one-tag/:id')
    async getTagById(@Param('id', ParseIntPipe) id: number) {
        const tag = await this.tagsService.findOne({
            id,
        });
        if (!tag) {
            throw new NotFoundException({
                message: 'Tag not found',
                details: `Tag with id: ${id} not found`,
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
        const tags = await this.tagsService.find({});
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
        const tagExists = await this.tagsService.findOne({
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

        const tag = await this.tagsService.create(createTagDto, admin_id);

        return {
            response: {
                message: 'Tag created successfully',
                tag,
            },
        };
    }

    @Patch('edit-tag/:id')
    async editTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
        const tag = await this.tagsService.findOne({ id });
        if (!tag) {
            throw new NotFoundException({
                message: 'Tag not found',
                details: `Tag with id: ${id} not found`,
            });
        }

        const updatedTag = await this.tagsService.update({ id }, updateTagDto);

        return {
            response: {
                message: 'Tag updated successfully',
                tag: updatedTag,
            },
        };
    }

    @Delete('tag/:id')
    async deleteTag(@Param('id', ParseIntPipe) id: number) {
        const tag = await this.tagsService.findOne({ id });
        if (!tag) {
            throw new ConflictException({
                message: 'Tag not found',
                details: `Tag with id: ${id} not found`,
            });
        }

        await this.tagsService.delete({ id });

        return {
            response: {
                message: 'Tag deleted successfully',
            },
        };
    }
}
