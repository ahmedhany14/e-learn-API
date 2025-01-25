import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './service/account.service';

@Module({
  controllers: [AccountController],
  exports: [AccountService],
  providers: [AccountService],
})
export class AccountModule {}
