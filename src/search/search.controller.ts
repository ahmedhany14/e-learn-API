import { Controller, Get, Inject, Param, ParseIntPipe, DefaultValuePipe, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.quary.dto';

// @AUTH(AuthEnum.BEARER)
@Controller('search')
export class SearchController {
    constructor(
        @Inject()
        private readonly searchService: SearchService,
    ) { }

    @Get('explore/topic/:tag')
    async getCourseWithTopic(
        @Param('tag') tag: string,
        @Query() searchQueryDto: SearchQueryDto
    ) {

        return await this.searchService.getCoursesWithTopic(tag, searchQueryDto);
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

    @Get('/:search_text')
    async getCourseBySearchText(
        @Param('search_text') searchText: string,
        @Query('rating') rating: number,
    ) {
        return `courses with search text ${searchText} and rating more than or equal ${rating}`;
    }
}
