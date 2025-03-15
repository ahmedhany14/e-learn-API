import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigurationsModule } from 'src/configurations/configurations.module';

@Module({
    imports: [ConfigurationsModule],
    providers: [StripeService],
    exports: [StripeService]
})
export class StripeModule { }