import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountSubscriptions } from './entity/account.plan.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AccountSubscriptions])],
    controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
