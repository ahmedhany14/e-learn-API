import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from '../entity/orders/order.entity';

@Injectable()
export class ApproveTransaction {
  private readonly logger = new Logger(ApproveTransaction.name);

  constructor(private readonly dataSource: DataSource) {}

  async approveOrder(orderId: number, adminId: number, userAccountId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // edit order as approved

      this.logger.log(`update order to approved`);
      await queryRunner.manager.update('orders', orderId, {
        is_approved: true,
        state: 'approved',
      });

      // push to order backlog as approved with order id and account id (admin)
      this.logger.log(`push to order backlog as approved`);
      await queryRunner.manager.insert('order_backlog', {
        state: 'approved',
        order: orderId,
        admin: adminId,
      });
      this.logger.log(`update account role to instructor`);
      await queryRunner.manager.update('account', userAccountId, {
        role: 'instructor',
      });

      this.logger.log('insert into instructor table');

      const order = (await queryRunner.manager.findOne('orders', {
        where: { id: orderId },
      })) as Order;
      await queryRunner.manager.insert('instructor', {
        payment_info: order.payment_info,
        stripe_info: order.stripe_info,
        national_id: order.national_id,
        account: userAccountId,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.log(error);

      throw new InternalServerErrorException('An unexpected error occurred');
    } finally {
      await queryRunner.release();
    }
  }
}
