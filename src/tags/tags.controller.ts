import { Controller, Get, Param } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { TagsEnum } from './entity/tags.enum';

@Controller('tags')
export class TagsController {

    constructor(
        private readonly tagsService: TagsService,
    ) { }

    @Get('all')
    async getAllTags() {
        const select = [TagsEnum.ID, TagsEnum.CATEGORY, TagsEnum.SUBCATEGORY, TagsEnum.TAG, TagsEnum.DESCRIPTION];
        return {
            response: await this.tagsService.getAllTags(select, [], {}),
        }
    }

    @Get('category/:category')
    async getTagsByCategory(
        @Param('category') category: string,
    ) {
        const select = [TagsEnum.ID, TagsEnum.SUBCATEGORY, TagsEnum.TAG, TagsEnum.DESCRIPTION];
        const filter = {
            category,
        };

        return {
            response: await this.tagsService.getAllTags(select, [], filter),
        };
    }

    @Get('subcategory/:subcategory')
    async getTagsBySubcategory(
        @Param('subcategory') subcategory: string,
    ) {
        const select = [TagsEnum.ID, TagsEnum.TAG, TagsEnum.DESCRIPTION];
        const filter = {
            subcategory,
        };
        return {
            response: await this.tagsService.getAllTags(select, [], filter),
        };
    }
}
