import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    page = 1,
    limit = 10,
    relations: string[] = [],
    baseUrl = '',
  ) {
    const [items, total] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations,
    });

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      items,
      meta: {
        totalResults: total,
        page,
        limit,
        totalPages,
        hasMore,
        firstPage: `${baseUrl}?page=1&limit=${limit}`,
        lastPage: `${baseUrl}?page=${totalPages}&limit=${limit}`,
        previous:
          page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
        next: hasMore ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
        current: `${baseUrl}?page=${page}&limit=${limit}`,
      },
    };
  }
}
