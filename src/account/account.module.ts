import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';

// Module
import { AdminModule } from '../admin/admin.module';
import { EmailModule } from '../common/email/email.module';
import { OrdersModule } from '../orders/orders.module';

// Repository and Service
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';
import { AuthModule } from '../auth/auth.module';

// Entity and ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { AccountRedisService } from './service/account.redis.service';
import { AppModule } from '../app.module';

@Module({
  controllers: [AccountController],
  exports: [AccountService],
  providers: [AccountService, AccountRepository, AccountRedisService],
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => AuthModule),
    forwardRef(() => AppModule),
    AdminModule,
    EmailModule,
    OrdersModule
  ],
})
export class AccountModule {}
