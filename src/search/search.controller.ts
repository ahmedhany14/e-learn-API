import { Controller, Get, Param, Query } from '@nestjs/common';
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';

@AUTH(AuthEnum.BEARER)
@Controller('search')
export class SearchController {
    @Get('/:search_text')
    async getCourseBySearchText(
        @Param('search_text') searchText: string,
        @Query('rating') rating: number,
    ) {
        return `courses with search text ${searchText} and rating more than or equal ${rating}`;
    }

    @Get('explore/topic/:tag')
    async getCourseWithTopic(@Param('tag') tag: string, @Query('rating') rating: number) {
        return `courses with topic ${tag} and rating more than or equal ${rating}`;
    }

    @Get('explore/category/:category')
    async getCourseWithCategory(
        @Param('category') category: string,
        @Query('rating') rating: number,
    ) {
        return `courses with category ${category} and rating more than or equal ${rating}`;
    }

    @Get('explore/:category/:subcategory')
    async getCourseWithSubCategory(
        @Param('category') category: string,
        @Param('subcategory') subcategory: string,
        @Query('rating') rating: number,
    ) {
        return `courses with category ${category}, subcategory ${subcategory} and rating more than or equal ${rating}`;
    }
}
