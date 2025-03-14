import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/configurations/config.service';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private readonly configService: ConfigService) {
        this.stripe = new Stripe(this.configService.stripeConfig.secretKey, {
            apiVersion: "2025-02-24.acacia",
            timeout: 2000,
            maxNetworkRetries: 3,
            telemetry: false,
            typescript: true,
        });
    }

    getInstance(): Stripe {
        return this.stripe;
    }

}
