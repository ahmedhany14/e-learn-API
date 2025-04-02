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
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';
import { ExtractAccountData } from '../../common/decorators/request.extractData.decorator';

// dto
import { CreateTagDto } from '../dtos/create.tag.dto';
import { UpdateTagDto } from '../dtos/update.tag.dto';

// services
import { TagsService } from '../services/tags.service';

// types
import { TagsEnum, TagsRelations } from '../entity/tags.enum';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('tags-via-admins')
export class TagsViaAdminsController {
    constructor(
        @Inject()
        private readonly tagsService: TagsService,
    ) { }

    @Get('one-tag/:tag_id')
    async getTagById(@Param('tag_id', ParseIntPipe) tag_id: number) {
        const select = [
            TagsEnum.ID,
            TagsEnum.CATEGORY,
            TagsEnum.SUBCATEGORY,
            TagsEnum.TAG,
            TagsEnum.DESCRIPTION,
        ];
        const relations = [TagsRelations.TAG_CREATOR];
        const tag = await this.tagsService.getTagById(select, relations, tag_id);
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
        const select = [
            TagsEnum.ID,
            TagsEnum.CATEGORY,
            TagsEnum.SUBCATEGORY,
            TagsEnum.TAG,
            TagsEnum.DESCRIPTION,
        ]
        const relations = [TagsRelations.TAG_CREATOR];
        const tags = await this.tagsService.getAllTags(select, relations);
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

    @Patch('edit-tag/:tag_id')
    async editTag(
        @Param('tag_id', ParseIntPipe) tag_id: number,
        @Body() updateTagDto: UpdateTagDto,
    ) {
        const select = [
            TagsEnum.ID,
            TagsEnum.CATEGORY,
            TagsEnum.SUBCATEGORY,
            TagsEnum.TAG,
            TagsEnum.DESCRIPTION,
        ];

        const tag = await this.tagsService.getTagById(select, [], tag_id);
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

    @Delete('tag/:tag_id')
    async deleteTag(@Param('tag_id', ParseIntPipe) tag_id: number) {
        const select = [TagsEnum.ID];
        const tag = await this.tagsService.getTagById(select, [], tag_id);
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
