import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

// entity and orm
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderBacklog } from '../entity/order.backlog.entity';

// dto
import { PaginationDto } from '../../common/pagination/pagination.dto';

// providers
import { PaginationService } from '../../common/pagination/pagination.service';

@Injectable()
export class BacklogOrdersProvider {
  constructor(
    @InjectRepository(OrderBacklog)
    private readonly orderBacklogRepository: Repository<OrderBacklog>,
    @Inject()
    private readonly paginationService: PaginationService,
  ) { }

  async getAllBacklog({
    select,
    filter,
    relations,
    paginationDto,
  }: {
    select: string[];
    filter: any;
    relations: string[];
    paginationDto: PaginationDto;
  }) {
    try {
      return await this.paginationService.paginate<OrderBacklog>(
        this.orderBacklogRepository,
        paginationDto.page,
        paginationDto.limit,
        relations,
        filter,
        select,
        'http://localhost:3000/admin/orders/backlog',
      );
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException({
        message: 'Error while fetching orders',
      });
    }
  }
}
