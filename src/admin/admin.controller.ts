import {
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
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

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    @Inject()
    private readonly adminService: AdminService,
  ) {}

  @Get('orders')
  async getRequests() {
    this.logger.log(`Get all requests`);

    return await this.adminService.findAll();
  }

  @Get('backlog')
  async getBacklog(@Query('state') state: string) {

    return await this.adminService.findAllBacklog(state);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: number) {
    this.logger.log(`Get order with id: ${orderId}`);

    return await this.adminService.findOne(orderId);
  }

  @Patch('approve/:orderId')
  async approve(
    @Param('orderId') orderId: number,
    @ExtractAccountData('id') id: number,
  ) {
    this.logger.log(`Approve order with id: ${orderId}`);

    await this.adminService.approveOrder(orderId, id);

    return { message: `Order with id: ${orderId} has been approved` };
  }

  @Patch('reject/:orderId')
  async reject(@Param('orderId') orderId: number) {
    this.logger.log(`Reject order with id: ${orderId}`);

    return await this.adminService.delete(orderId);
  }
}
