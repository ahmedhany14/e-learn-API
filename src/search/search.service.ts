import { Inject, Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { SearchQueryDto } from './dto/search.quary.dto';

@Injectable()
export class SearchService {
    constructor(
        @Inject()
        private readonly searchRepository: SearchRepository,
    ) { }

    async getCoursesWithTopic(tag: string, searchQueryDto: SearchQueryDto) {
        return await this.searchRepository.getCoursesWithTopic(tag, searchQueryDto);
    }
}
