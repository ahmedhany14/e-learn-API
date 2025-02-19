import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';

// Module
import { AdminModule } from '../admin/admin.module';
import { EmailModule } from '../common/email/email.module';

// Repository and Service
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';
import { AuthModule } from '../auth/auth.module';

// Entity and ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { AccountRedisService } from './service/account.redis.service';
import { AppModule } from '../app.module';

// Config
import { ConfigModule } from '@nestjs/config';
import redisCon from '../common/config/redis.conf';

@Module({
  controllers: [AccountController],
  exports: [AccountService],
  providers: [AccountService, AccountRepository, AccountRedisService],
  imports: [
    TypeOrmModule.forFeature([Account]),
    ConfigModule.forFeature(redisCon),

    forwardRef(() => AuthModule),
    forwardRef(() => AppModule),
    AdminModule,
    EmailModule,
  ],
})
export class AccountModule {}
