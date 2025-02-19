import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';

// repo , entity and orm
import { Order } from '../entity/orders/order.entity';
import { Account } from '../../account/entity/account.entity';

// dto
import { UpgradeToInstructorDto } from '../../account/dtos/upgrade.to.instructor.dto';

// providers and services
import { ApproveTransaction } from '../providers/approve.transaction';
import { RejectTransaction } from '../providers/reject.transaction';
import { OrdersService } from '../sevices/orders.service';
import { PlanRepository } from '../repository/plan.repo';
import { CreatePlanDto } from '../dtos/create.plan.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @Inject()
    private readonly orderService: OrdersService,
    @Inject()
    private readonly approveTransaction: ApproveTransaction,
    @Inject()
    private readonly rejectTransaction: RejectTransaction,

    @Inject()
    private readonly planRepository: PlanRepository,
  ) {}

  async createPlan(plan: CreatePlanDto, admin_id: number) {
    return await this.planRepository.createPlan(plan, admin_id);
  }

  async approveOrder(orderId: number, adminId: number) {
    const order = await this.findOne(orderId);

    if (!order) {
      throw new ConflictException({
        message: 'Order not found',
        details: `Order with id: ${orderId} not found`,
      });
    }

    if (order.is_approved) {
      throw new ConflictException({ message: 'Order already approved' });
    }

    await this.approveTransaction.approveOrder(
      orderId,
      adminId,
      order.account.id,
    );
    return order.account.email;
  }

  async rejectOrder(orderId: number, adminId: number) {
    const order = await this.findOne(orderId);

    if (order.state === 'rejected') {
      throw new ConflictException({ message: 'Order already rejected' });
    }

    await this.rejectTransaction.rejectOrder(orderId, adminId);
    return order.account.email;
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderService.getOneOrder(id);
  }
}
