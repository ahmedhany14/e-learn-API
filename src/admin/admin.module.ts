import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

// services and repository
import { AdminService } from './sevices/admin.service';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderBacklog } from './entity/order.backlog.entity';
import { ApproveTransaction } from './providers/approve.transaction';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ApproveTransaction],
  imports: [
    TypeOrmModule.forFeature([Order, OrderBacklog]),
  ],
  exports: [AdminService],
})
export class AdminModule {}
