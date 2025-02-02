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

// dtos
import { PaginationDto } from '../common/pagination/pagination.dto';

//services
import { AdminService } from './sevices/admin.service';
import { Email } from '../common/email/email';

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

  @Get('orders')
  async getRequests(
    @Query('statues') statues: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.adminService.findAll(statues, paginationDto);
  }

  @Get('backlog')
  async getBacklog(
    @Query('state') state: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.adminService.findAllBacklog(state, paginationDto);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: number) {
    this.logger.log(`Get order with id: ${orderId}`);

    return { response: await this.adminService.findOne(orderId) };
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

    return { response: await this.adminService.delete(orderId) };
  }
}
