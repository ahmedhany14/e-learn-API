import { Inject, Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
    constructor(
        @Inject()
        private readonly searchRepository: SearchRepository,
    ) {}
}
