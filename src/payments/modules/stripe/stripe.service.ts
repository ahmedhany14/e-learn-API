import Stripe from 'stripe';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@app/configurations';

import {
    PaymentMetadataI,
    PlanPaymentMetadataI,
} from '../../interfaces/payment.metadata.interface';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private readonly configService: ConfigService) {
        this.stripe = new Stripe(this.configService.stripeConfig.secretKey, {
            apiVersion: '2025-02-24.acacia',
            timeout: 2000,
            maxNetworkRetries: 3,
            telemetry: false,
            typescript: true,
        });
    }

    async processPayment(
        price: number,
        paymentMethodId: string,
        metadata: PaymentMetadataI | PlanPaymentMetadataI,
    ): Promise<Stripe.PaymentIntent> {
        try {
            return await this.stripe.paymentIntents.create({
                amount: price * 100, // convert to cents
                currency: 'usd',
                payment_method: paymentMethodId,
                payment_method_types: ['card'],
                confirm: true,
                metadata: {
                    ...metadata,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Process payment failed',
                details: error.message,
            });
        }
    }

    async refundPayment(chargeId: string): Promise<Stripe.Refund> {
        try {
            return await this.stripe.refunds.create({
                charge: chargeId,
                reason: 'requested_by_customer',
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Refund payment failed',
                details: error.message,
            });
        }
    }
}
