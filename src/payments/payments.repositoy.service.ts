import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsHistory } from './entities/payments.history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsRepositoyService {
    constructor(
        @InjectRepository(PaymentsHistory)
        private readonly paymentsRepository: Repository<PaymentsHistory>
    ) { }

    async createPaymentHistory(data: any, account_id: number) {
        try {
            const pay_history = this.paymentsRepository.create({
                ...data,
                account: { id: account_id }
            })

            return await this.paymentsRepository.save(pay_history);
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error creating payment history',
                details: e.message
            });
        }
    }

}
