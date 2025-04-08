import { Controller, Get, Param } from '@nestjs/common';
import { TagsService } from './services/tags.service';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get('all')
    async getAllTags() {
        return {
            response: {
                message: 'All tags fetched successfully',
                tags: await this.tagsService.find({}),
            },
        };
    }

    @Get('category/:category')
    async getTagsByCategory(@Param('category') category: string) {
        return {
            response: {
                message: 'Tags fetched successfully',
                tags: await this.tagsService.find({
                    category,
                }),
            },
        };
    }

    @Get('subcategory/:subcategory')
    async getTagsBySubcategory(@Param('subcategory') subcategory: string) {
        return {
            response: {
                message: 'Tags fetched successfully',
                tags: await this.tagsService.find({
                    subcategory,
                }),
            },
        };
    }
}
