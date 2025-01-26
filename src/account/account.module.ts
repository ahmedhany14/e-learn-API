import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';

// Repository and Service
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';
import { AuthModule } from '../auth/auth.module';

// Entity and ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';

@Module({
  controllers: [AccountController],
  exports: [AccountService],
  providers: [AccountService, AccountRepository],
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => AuthModule),
  ],
})
export class AccountModule {}
