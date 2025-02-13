import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
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

// swagger
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiSecurity('access-token')
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

  @ApiOperation({
    summary: 'Create a new plan',
    description: 'Allows admins to create a new plan.',
  })
  @ApiBody({ type: CreatePlanDto })
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 201,
    description: 'New plan has been created successfully',
    schema: {
      type: 'object',
      properties: {
        response: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            plan_name: { type: 'string', example: 'Premium Plan' },
            plan_price: { type: 'number', example: 29.99 },
            plan_duration: { type: 'number', example: 30 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
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

  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve order details by ID.',
  })
  @ApiParam({ name: 'order_id', required: true, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        response: {
          type: 'object',
          properties: {
            data: { type: 'string', example: 'order data' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @Get(':order_id')
  async getOrder(@Param() getOrderDto: GetOrderDto) {
    this.logger.log(`Get order with id: ${getOrderDto.order_id}`);

    return {
      response:
        (await this.adminService.findOne(getOrderDto.order_id)) ??
        'Order not found',
    };
  }

  @ApiOperation({
    summary: 'Approve an order',
    description: 'Admin approves an order by its ID.',
  })
  @ApiParam({
    name: 'order_id',
    required: true,
    description: 'Order ID to approve',
  })
  @ApiSecurity('access-token')
  @ApiResponse({ status: 200, description: 'Order approved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
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

  @ApiOperation({
    summary: 'Reject an order',
    description: 'Admin rejects an order by its ID.',
  })
  @ApiParam({
    name: 'orderId',
    required: true,
    description: 'Order ID to reject',
  })
  @ApiSecurity('access-token')
  @ApiResponse({ status: 200, description: 'Order rejected successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
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
