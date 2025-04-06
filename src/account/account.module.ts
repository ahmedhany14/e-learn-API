import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';

// Module
import { EmailModule } from '../common/email/email.module';
import { AppModule } from '../app.module';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
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
    imports: [
        TypeOrmModule.forFeature([Account]),
        forwardRef(() => AuthModule),
        forwardRef(() => AppModule),
        EmailModule,
        RedisModule,
    ],
})
export class AccountModule {}
