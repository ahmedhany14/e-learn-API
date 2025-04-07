import { Inject, Injectable } from '@nestjs/common';
import { SearchQueryDto } from './dto/search.quary.dto';
import { SearchTagsProvider } from './providers/search.tags.provider';
import { SearchCategoryProvider } from './providers/search.category.provider';
import { SearchCategorySubCategoryProvider } from './providers/search.category.sub-category.provider';

@Injectable()
export class SearchService {
    constructor(
        @Inject()
        private readonly searchTagsProvider: SearchTagsProvider,
        @Inject()
        private readonly searchCategoryProvider: SearchCategoryProvider,
        @Inject()
        private readonly searchCategorySubCategoryProvider: SearchCategorySubCategoryProvider,
    ) {}

    async getCoursesWithTopic(tag: string, searchQueryDto: SearchQueryDto) {
        return await this.searchTagsProvider.getCoursesWithTopic(tag, searchQueryDto);
    }

    async getCoursesWithCategory(category: string, searchQueryDto: SearchQueryDto) {
        return await this.searchCategoryProvider.getCoursesWithCategory(category, searchQueryDto);
    }

    async getCoursesWithCategoryAndSubCategory(
        category: string,
        subCategory: string,
        searchQueryDto: SearchQueryDto,
    ) {
        return await this.searchCategorySubCategoryProvider.getCoursesWithCategory(
            category,
            subCategory,
            searchQueryDto,
        );
    }
}
