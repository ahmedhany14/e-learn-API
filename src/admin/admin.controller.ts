import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch, Post,
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

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    @Inject()
    private readonly adminService: AdminService,
    @Inject()
    private readonly email: Email,
  ) {}

  @Post('new-plan')
  async createPlan(
    @Body() createPlanDto: CreatePlanDto,
    @ExtractAccountData('id') admin_id: number,
  ) {
    this.logger.log('Create new plan');

    const plan = await this.adminService.createPlan(createPlanDto, admin_id);

    return {
      response: plan,
    };
  }

  @Get(':order_id')
  async getOrder(@Param() getOrderDto: GetOrderDto) {
    this.logger.log(`Get order with id: ${getOrderDto.order_id}`);

    return {
      response: (await this.adminService.findOne(getOrderDto.order_id)) ?? 'Order not found',
    };
  }

  @Patch('approve/:order_id')
  async approve(
    @Param('order_id') order_id: number,
    @ExtractAccountData('id') id: number,
  ) {
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
    this.logger.log(`Reject order with id: ${orderId}`);

    const email = await this.adminService.rejectOrder(orderId, id);
    await this.email.sendRejectedEmail(orderId, email);

    return { response: `Order with id: ${orderId} has been rejected` };
  }
}
