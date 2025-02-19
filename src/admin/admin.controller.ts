import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

//decorators and enums
import { AUTH } from '../auth/decorators/auth.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

//services
import { AdminService } from './sevices/admin.service';
import { Email } from '../common/email/email';

//dtos
import { GetOrderDto } from './dtos/get.order.dto';
import { CreatePlanDto } from './dtos/create.plan.dto';
import { OrdersService } from './sevices/orders.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { OrderEnum } from 'src/admin/entity/orders/order.enum';
import { OrderbacklogEnum } from 'src/admin/entity/orders/orderbacklog.enum';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('admin-dashboard')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    @Inject()
    private readonly adminService: AdminService,
    @Inject()
    private readonly ordersService: OrdersService,

    @Inject()
    private readonly email: Email,
  ) {}

  /*
                                   PLAN ENDPOINTS
    ---------------------------------------------------------------------------------
  */

  @Post('new-plan')
  async createPlan(
    @Body() createPlanDto: CreatePlanDto,
    @ExtractAccountData('id') admin_id: number,
  ) {
    /*
        API Endpoint to create a new plan

        Steps:
            get the admin id from the request
            call the admin service to create a new plan associated with the admin id
    */

    this.logger.log('Create new plan');

    const plan = await this.adminService.createPlan(createPlanDto, admin_id);

    return {
      response: plan,
    };
  }

  @Get('plans')
  async getPlans() {
    /*
      API Endpoint to get all plans

      steps:
        call the admin service to get all plans
    */

    this.logger.log('Get all plans');

    return {
      response: '', //await this.adminService.getPlans(),
    };
  }

  @Get('plan/:plan_id')
  async getPlan(@Param('plan_id') plan_id: number) {
    /*
      API Endpoint to get a plan by id

      steps:
        get the plan id from the request
        call the admin service to get the plan by id
    */

    this.logger.log(`Get plan with id: ${plan_id}`);

    return {
      response: '', //await this.adminService.getPlan(plan_id),
    };
  }

  /*
                                   ORDER ENDPOINTS
    ---------------------------------------------------------------------------------
  */

  @Get('submited-orders')
  async getOrders(@Query() paginationDto: PaginationDto) {
    /*
      API Endpoint to get all orders
      steps:
        use the orders service to get all orders based on the pagination dto (state, page, limit, etc...)
    */

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

    const orders = await this.ordersService.getAllOrders({
      select: select,
      filter: filter,
      relations: relations,
      paginationDto: paginationDto,
    });

    return {
      response: orders,
    };
  }

  @Get(':order_id')
  async getOrder(@Param() getOrderDto: GetOrderDto) {
    /*
      API Endpoint to get an order by id

      Steps:
        get the order id from the request
        call the admin service to get the order by id
    */

    this.logger.log(`Get order with id: ${getOrderDto.order_id}`);

    return {
      response:
        (await this.adminService.findOne(getOrderDto.order_id)) ??
        'Order not found',
    };
  }

  @Patch('approve/:order_id')
  async approve(
    @Param('order_id') order_id: number,
    @ExtractAccountData('id') id: number,
  ) {
    /*
      API Endpoint to approve an order

      steps:
        get the order id from the request
        get admin id from the request
        call the admin service to approve the order, with the order id and admin id
    */

    this.logger.log(`Approve order with id: ${order_id}`);

    const email = await this.adminService.approveOrder(order_id, id);

    await this.email.sendApprovedEmail(order_id, email);
    return {
      response: `Order with id: ${order_id} has been approved`,
    };
  }

  @Patch('reject/:orderId')
  async reject(
    @Param('orderId') orderId: number,
    @ExtractAccountData('id') id: number,
  ) {
    /*
      API Endpoint to reject an order

      steps:
        get the order id from the request
        get admin id from the request
        call the admin service to reject the order, with the order id and admin id
    */

    this.logger.log(`Reject order with id: ${orderId}`);

    const email = await this.adminService.rejectOrder(orderId, id);
    await this.email.sendRejectedEmail(orderId, email);

    return { response: `Order with id: ${orderId} has been rejected` };
  }

  /*
                                    Reviewed Orders ENDPOINTS
      --------------------------------------------------------------------------------- 
  */

  @Get('reviewed-orders')
  async getReviewedOrders(@Query() paginationDto: PaginationDto) {
    /*
        API Endpoint to get all reviewed orders
        steps:
          use the orders service to get all orders based on the pagination dto (state, page, limit, etc...)
    */

    const select = [
      OrderbacklogEnum.ID,
      OrderbacklogEnum.STATE,
      OrderbacklogEnum.ADMIN,
    ];

    const filter = {
      state: paginationDto.state,
    };
    const relations = ['admin', 'order'];

    const reviewedOrders = await this.ordersService.getAllBacklog({
      select: select,
      filter: filter,
      relations: relations,
      paginationDto: paginationDto,
    });

    return {
      response: reviewedOrders,
    };
  }
}
