import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';

import {PaginationModule} from '../common/pagination/pagination.module';

// services and providers
import { OrdersService } from './services/orders.service';
import { OrdersProvider } from './providers/orders.provider';
import { BacklogOrdersProvider } from './providers/backlog.orders.provider';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderBacklog } from './entity/order.backlog.entity';
import { Order } from './entity/order.entity';

@Module({
  controllers: [OrdersController],
  imports:[
    TypeOrmModule.forFeature([Order, OrderBacklog]),
    PaginationModule
  ],
  providers: [OrdersService, OrdersProvider, BacklogOrdersProvider],
  exports: [OrdersService]
})
export class OrdersModule {}
