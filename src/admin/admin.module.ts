import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

// modules
import { EmailModule } from '../common/email/email.module';

// services and repository
import { AdminService } from './sevices/admin.service';
import { ApproveTransaction } from './providers/approve.transaction';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderBacklog } from './entity/order.backlog.entity';
import { RejectTransaction } from './providers/reject.transaction';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ApproveTransaction, RejectTransaction],
  imports: [
    TypeOrmModule.forFeature([Order, OrderBacklog]),
    EmailModule,
  ],
  exports: [AdminService],
})
export class AdminModule {}
