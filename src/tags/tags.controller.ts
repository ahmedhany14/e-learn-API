import { Controller, Get, Param } from '@nestjs/common';
import { TagsService } from './services/tags.service';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get('all')
    async getAllTags() {
        return {
            response: await this.tagsService.findAllTags({}),
        };
    }

    @Get('category/:category')
    async getTagsByCategory(@Param('category') category: string) {
        const filter = {
            category,
        };

        return {
            response: await this.tagsService.findAllTags(filter),
        };
    }

    @Get('subcategory/:subcategory')
    async getTagsBySubcategory(@Param('subcategory') subcategory: string) {
        const filter = {
            subcategory,
        };
        return {
            response: await this.tagsService.findAllTags(filter),
        };
    }
}
