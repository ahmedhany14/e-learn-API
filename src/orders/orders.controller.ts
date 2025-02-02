import { Controller, Get, Inject, Query } from '@nestjs/common';

// dto
import { PaginationDto } from '../common/pagination/pagination.dto';

// enums
import { OrderEnum } from './entity/order.enum';
import { OrderbacklogEnum } from './entity/orderbacklog.enum';

// services
import { OrdersService } from './services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject()
    private readonly ordersService: OrdersService,
  ) {}

  @Get('requests')
  async getRequests(
    @Query('statues') statues: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const select = [
      OrderEnum.ID,
      OrderEnum.PAYMENT_INFO,
      OrderEnum.NATIONAL_ID,
      OrderEnum.STRIPE_INFO,
      OrderEnum.STATUES,
    ];
    const filter = {
      statues: statues,
    };
    const relations = ['account'];

    return await this.ordersService.getAllOrders({
      select: select,
      filter: filter,
      relations: relations,
      paginationDto: paginationDto,
    });
  }

  @Get('backlog')
  async getBacklog(@Query() paginationDto: PaginationDto) {
    const select = [
      OrderbacklogEnum.ID,
      OrderbacklogEnum.STATE,
      OrderbacklogEnum.ACCOUNT,
    ];

    const filter = {
      state: paginationDto.state,
    };
    const relations = ['account', 'order'];

    return await this.ordersService.getAllBacklog({
      select,
      filter,
      relations,
      paginationDto,
    });
  }
}
