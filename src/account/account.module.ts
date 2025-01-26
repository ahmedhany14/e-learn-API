import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';

// Repository and Service
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';

// Entity and ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';

@Module({
  controllers: [AccountController],
  exports: [AccountService],
  providers: [AccountService, AccountRepository],
  imports: [TypeOrmModule.forFeature([Account])],
})
export class AccountModule {}
