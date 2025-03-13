import { forwardRef, Module } from '@nestjs/common';

// controllers
import { AdminPrivacyController } from './controllers/admin.privacy.controller';
import { AdminController } from './controllers/admin.manage.orders.controller';

// modules
import { EmailModule } from '../common/email/email.module';
import { AccountModule } from 'src/account/account.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

// services and repository
import { AdminService } from './sevices/admin.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersProvider } from '../orders/providers/orders.provider';
import { BacklogOrdersProvider } from '../orders/providers/backlog.orders.provider';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entity/order.entity';
import { OrderBacklog } from '../orders/entity/order.backlog.entity';
import { AdminPrivacyService } from './sevices/admin.privacy.service';

@Module({
    controllers: [AdminController, AdminPrivacyController],
    providers: [
        AdminService,
        OrdersService,
        OrdersProvider,
        BacklogOrdersProvider,
        AdminPrivacyService,
    ],
    imports: [
        TypeOrmModule.forFeature([Order, OrderBacklog]),
        forwardRef(() => AccountModule),
        EmailModule,
        PaginationModule,
    ],
    exports: [AdminService, OrdersService],
})
export class AdminModule {}
