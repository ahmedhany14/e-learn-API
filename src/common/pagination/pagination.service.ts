import { Injectable } from '@nestjs/common';
import { FindOptionsSelect, Repository } from 'typeorm';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    page = 1,
    limit = 10,
    relations: string[],
    filter = {},
    select: string[],
    baseUrl = '',
  ) {
    const [items, total] = await repository.findAndCount({
      where: filter,
      skip: (page - 1) * limit,
      take: limit,
      select: select as unknown as FindOptionsSelect<T>,
      relations,
    });


    const totalPages = Math.round(total / limit);
    const hasMore = page < totalPages;

    return {
      response: items,
      meta: {
        total,
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
