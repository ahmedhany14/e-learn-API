import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

// modules
import { EmailModule } from '../common/email/email.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

// services and repository
import { AdminService } from './sevices/admin.service';
import { ApproveTransaction } from './providers/approve.transaction';
import { OrdersService } from './sevices/orders.service';
import { OrdersProvider } from './providers/orders/orders.provider';
import { BacklogOrdersProvider } from './providers/orders/backlog.orders.provider';
import { AdminPrivacyController } from './controllers/admin.privacy.controller';
import { CourseReviewRepository } from './repository/coures.review.repo';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/orders/order.entity';
import { OrderBacklog } from './entity/orders/order.backlog.entity';
import { RejectTransaction } from './providers/reject.transaction';
import { Plan } from './entity/plan.entity';
import { PlanRepository } from './repository/plan.repo';
import { Plan_Account } from './entity/account.plan.entity';
import { PlansService } from './sevices/plans.service';
import { CourseReview } from './entity/courses/course.reviwe.entity';
import { AdminPrivacyService } from './sevices/admin.privacy.service';
import { AccountModule } from 'src/account/account.module';

@Module({
  controllers: [AdminController, AdminPrivacyController],
  providers: [
    AdminService,
    PlanRepository,
    CourseReviewRepository,
    ApproveTransaction,
    RejectTransaction,
    OrdersService,
    OrdersProvider,
    BacklogOrdersProvider,
    PlansService,
    AdminPrivacyService,
  ],
  imports: [
    TypeOrmModule.forFeature([Order, OrderBacklog, Plan, Plan_Account, CourseReview]),
    forwardRef(() => AccountModule),
    EmailModule,
    PaginationModule,
  ],
  exports: [AdminService, OrdersService],
})
export class AdminModule { }
