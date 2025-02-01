import { Controller, Delete, Get, Inject, Param } from '@nestjs/common';

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
  constructor(
    @Inject()
    private readonly adminService: AdminService,
  ) {}

  @Get()
  async getOrder(@Param('orderId') orderId: number) {
    return await this.adminService.findOne(orderId);
  }
  @Get('requests')
  async getRequests() {
    return await this.adminService.findAll();
  }

  @Get('approve/:orderId')
  async approve(@Param('orderId') orderId: number) {
    return await this.adminService.approveOrder(orderId);
  }

  @Delete('reject/:orderId')
  async reject(@Param('orderId') orderId: number) {
    return await this.adminService.delete(orderId);
  }
}
