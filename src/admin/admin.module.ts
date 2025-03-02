import { forwardRef, Module } from '@nestjs/common';

// controllers
import { AdminManagePlansController } from './controllers/admin.manage.plans.controller';
import { AdminPrivacyController } from './controllers/admin.privacy.controller';
import { AdminController } from './admin.controller';

// modules
import { EmailModule } from '../common/email/email.module';
import { AccountModule } from 'src/account/account.module';
import { PlansModule } from 'src/plans/plans.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

// services and repository
import { AdminService } from './sevices/admin.service';
import { ApproveTransaction } from './providers/approve.transaction';
import { OrdersService } from '../orders/orders.service';
import { OrdersProvider } from '../orders/providers/orders.provider';
import { BacklogOrdersProvider } from '../orders/providers/backlog.orders.provider';
import { CourseReviewRepository } from './repository/coures.review.repo';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entity/order.entity';
import { OrderBacklog } from '../orders/entity/order.backlog.entity';
import { RejectTransaction } from './providers/reject.transaction';
import { CourseReview } from './entity/courses/course.reviwe.entity';
import { AdminPrivacyService } from './sevices/admin.privacy.service';


@Module({
  controllers: [AdminController, AdminPrivacyController, AdminManagePlansController],
  providers: [
    AdminService,
    CourseReviewRepository,
    ApproveTransaction,
    RejectTransaction,
    OrdersService,
    OrdersProvider,
    BacklogOrdersProvider,
    AdminPrivacyService,
  ],
  imports: [
    TypeOrmModule.forFeature([Order, OrderBacklog, CourseReview]),
    forwardRef(() => AccountModule),
    EmailModule,
    PlansModule,
    PaginationModule,
  ],
  exports: [AdminService, OrdersService],
})
export class AdminModule { }
