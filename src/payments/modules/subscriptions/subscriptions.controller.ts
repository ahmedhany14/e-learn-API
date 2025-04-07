import { Body, Controller, Delete, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';

// auth decorator
import { AUTH } from '../../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../../auth/enums/auth.enum';
import { SubscriptionsService } from './subscriptions.service';
import { ExtractAccountData } from '@app/decorators';
import { VisaPaymentDataDto } from '../enroll-courses/dto/payment.data.dto';

@AUTH(AuthEnum.BEARER)
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        @Inject()
        private readonly subscriptionsService: SubscriptionsService,
    ) {}

    @Post('check-out/:plan_id')
    async createSubscription(
        @Param('plan_id', ParseIntPipe) plan_id: number,
        @ExtractAccountData('id') account_id: number,
        @Body() visaPaymentDataDto: VisaPaymentDataDto,
    ) {
        await this.subscriptionsService.processCreateSubscription(
            plan_id,
            account_id,
            visaPaymentDataDto,
        );

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
