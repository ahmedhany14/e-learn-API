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

//swagger
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject()
    private readonly ordersService: OrdersService,
  ) {}

  @ApiOperation({
    summary: 'Get order requests',
    description: 'Fetch all order requests based on their state.',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    type: 'string',
    example: 'pending',
  })
  @ApiQuery({
    name: 'pagination',
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      sort: { type: 'string', example: 'ASC' },
      state: { type: 'string', example: 'pending' },
    },
  })
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description: 'Orders fetched successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          payment_info: { type: 'string', example: 'Credit Card' },
          national_id: { type: 'string', example: '123456789' },
          stripe_info: { type: 'string', example: 'Stripe Transaction ID' },
          state: { type: 'string', example: 'pending' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiOperation({
    summary: 'Get order backlog',
    description: 'Retrieve backlog orders for admin review.',
  })
  @ApiQuery({
    name: 'pagination',
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      sort: { type: 'string', example: 'ASC' },
      state: { type: 'string', example: 'pending' },
    },
  })
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description: 'Backlog orders retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          data: {type: 'string', example: 'orders data'},
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
