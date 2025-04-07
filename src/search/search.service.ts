import { Inject, Injectable } from '@nestjs/common';
import { SearchQueryDto } from './dto/search.quary.dto';
import { SearchTagsProvider } from './providers/search.tags.provider';

@Injectable()
export class SearchService {
    constructor(
        @Inject()
        private readonly searchTagsProvider: SearchTagsProvider,
    ) { }

    async getCoursesWithTopic(tag: string, searchQueryDto: SearchQueryDto) {
        //return await this.searchRepository.getCoursesWithTopic(tag, searchQueryDto);
        return await this.searchTagsProvider.getCoursesWithTopic(tag, searchQueryDto);
    }
}
