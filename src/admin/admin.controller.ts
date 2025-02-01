import { Controller, Delete, Get, Inject, Logger, Param } from '@nestjs/common';

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

  @Get('')
  async getRequests() {
    this.logger.log(`Get all requests`);

    return await this.adminService.findAll();
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: number) {
    this.logger.log(`Get order with id: ${orderId}`);

    return await this.adminService.findOne(orderId);
  }

  @Get('approve/:orderId')
  async approve(@Param('orderId') orderId: number) {
    this.logger.log(`Approve order with id: ${orderId}`);

    return await this.adminService.approveOrder(orderId);
  }

  @Delete('reject/:orderId')
  async reject(@Param('orderId') orderId: number) {
    this.logger.log(`Reject order with id: ${orderId}`);

    return await this.adminService.delete(orderId);
  }
}
