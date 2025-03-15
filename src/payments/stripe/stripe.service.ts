import Stripe from 'stripe';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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


    async processPayment(
        price: number,
        paymentMethodId: string
    ): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: price * 100, // convert to cents
                currency: 'usd',
                payment_method: paymentMethodId,
                payment_method_types: ['card'],
                confirm: true,
            });

            return paymentIntent;
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Process payment failed',
                details: error.message,
            });
        }
    }
}
