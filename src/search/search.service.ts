import { Inject, Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
    constructor(
        @Inject()
        private readonly searchRepository: SearchRepository,
    ) {}

    async getCoursesWithTopic(tag: string, rating: number = 0, page: number = 1) {
        return await this.searchRepository.getCoursesWithTopic(tag, rating, page);
    }
}
