import { Controller, Get, Inject, Query } from '@nestjs/common';

// dto
import { PaginationDto } from '../common/pagination/pagination.dto';

// enums
import { OrderEnum } from './entity/order.enum';
import { OrderbacklogEnum } from './entity/orderbacklog.enum';
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

// services
import { OrdersService } from './services/orders.service';


@Controller('orders')
export class OrdersController {
  constructor(
    @Inject()
    private readonly ordersService: OrdersService,
  ) {}

  @ROLE(RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Get('requests')
  async getRequests(@Query() paginationDto: PaginationDto) {
    const select = [
      OrderEnum.ID,
      OrderEnum.PAYMENT_INFO,
      OrderEnum.NATIONAL_ID,
      OrderEnum.STRIPE_INFO,
      OrderEnum.STATE,
    ];
    const filter = {
      state: paginationDto.state,
    };
    const relations = ['account'];

    return await this.ordersService.getAllOrders({
      select: select,
      filter: filter,
      relations: relations,
      paginationDto: paginationDto,
    });
  }

  @ROLE(RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Get('backlog')
  async getBacklog(@Query() paginationDto: PaginationDto) {
    const select = [
      OrderbacklogEnum.ID,
      OrderbacklogEnum.STATE,
      OrderbacklogEnum.ADMIN,
    ];

    const filter = {
      state: paginationDto.state,
    };
    const relations = ['admin', 'order'];

    return await this.ordersService.getAllBacklog({
      select,
      filter,
      relations,
      paginationDto,
    });
  }
}
