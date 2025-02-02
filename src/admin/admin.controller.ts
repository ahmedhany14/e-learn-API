import {
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
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
import { GetOrderDto } from './dtos/get.order.dto';

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

  @Get(':orderId')
  async getOrder(@Param() getOrderDto: GetOrderDto) {
    this.logger.log(`Get order with id: ${getOrderDto.orderId}`);

    return {
      response: (await this.adminService.findOne(getOrderDto.orderId)) ?? 'Order not found',
    };
  }

  @Patch('approve/:orderId')
  async approve(
    @Param('orderId') orderId: number,
    @ExtractAccountData('id') id: number,
  ) {
    this.logger.log(`Approve order with id: ${orderId}`);

    const email = await this.adminService.approveOrder(orderId, id);

    await this.email.sendApprovedEmail(orderId, email);
    return {
      response: `Order with id: ${orderId} has been approved`,
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
