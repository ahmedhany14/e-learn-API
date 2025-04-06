import { Controller, Delete, Param, Post } from '@nestjs/common';

// auth decorator
import { AUTH } from '../../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../../auth/enums/auth.enum';

@AUTH(AuthEnum.BEARER)
@Controller('subscriptions')
export class SubscriptionsController {
    @Post('plan/:plan_id')
    async createSubscription(@Param('plan_id') plan_id: string) {
        // Logic to create a subscription
        return {
            message: 'Subscription created successfully',
        };
    }

    @Delete('plan/:plan_id')
    async cancelSubscription(@Param('plan_id') plan_id: string) {
        // Logic to cancel a subscription
        return {
            message: 'Subscription canceled successfully',
        };
    }
}
