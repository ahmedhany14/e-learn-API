import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

// modules
import { OrdersModule } from '../orders/orders.module';
import { EmailModule } from '../common/email/email.module';

// services and repository
import { AdminService } from './sevices/admin.service';
import { ApproveTransaction } from './providers/approve.transaction';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entity/order.entity';
import { OrderBacklog } from '../orders/entity/order.backlog.entity';
import { RejectTransaction } from './providers/reject.transaction';
import { Plan } from './entity/plan.entity';
import { PlanRepository } from './repository/plan.repo';
import { Plan_Account } from './entity/account.plan.entity';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PlanRepository, ApproveTransaction, RejectTransaction],
  imports: [
    TypeOrmModule.forFeature([Order, OrderBacklog, Plan, Plan_Account]),
    EmailModule,
    OrdersModule
  ],
  exports: [AdminService],
})
export class AdminModule {}
