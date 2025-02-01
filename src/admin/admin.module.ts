import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

// services and repository
import { AdminService } from './sevices/admin.service';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([Order]),
  ],
})
export class AdminModule {}
