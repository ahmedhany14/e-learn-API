import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.quary.dto';

import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// @AUTH(AuthEnum.BEARER)
@Controller('search')
export class SearchController {
    constructor(
        @Inject()
        private readonly searchService: SearchService,
    ) {}

    @Get('explore/topic/:tag')
    async getCourseWithTopic(@Param('tag') tag: string, @Query() searchQueryDto: SearchQueryDto) {
        return await this.searchService.getCoursesWithTopic(tag, searchQueryDto);
    }

    @Get('explore/category/:category')
    async getCourseWithCategory(
        @Param('category') category: string,
        @Query() searchQueryDto: SearchQueryDto,
    ) {
        return await this.searchService.getCoursesWithCategory(category, searchQueryDto);
    }

    @Get('explore/:category/:subcategory')
    async getCourseWithSubCategory(
        @Param('category') category: string,
        @Param('subcategory') subcategory: string,
        @Query() searchQueryDto: SearchQueryDto,
    ) {
        return await this.searchService.getCoursesWithCategoryAndSubCategory(
            category,
            subcategory,
            searchQueryDto,
        );
    }

    @Get(':search_text')
    async getCourseBySearchText(
        @Param('search_text') searchText: string,
        @Query() searchQueryDto: SearchQueryDto,
    ) {
        const text = searchText.replace(' ', '').trim();
        return await this.searchService.getCoursesWithText(text, searchQueryDto);
    }
}
