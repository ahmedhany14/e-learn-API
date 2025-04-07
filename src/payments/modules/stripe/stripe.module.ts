import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigurationsModule } from '@app/configurations';

@Module({
    imports: [ConfigurationsModule],
    providers: [StripeService],
    exports: [StripeService],
})
export class StripeModule {}
