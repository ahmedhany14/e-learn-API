import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from '../../orders/entity/order.entity';

@Injectable()
export class ApproveTransaction {
  private readonly logger = new Logger(ApproveTransaction.name);

  constructor(private readonly dataSource: DataSource) { }

  async approveOrder(user_order: Order, adminId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // edit order as approved

      this.logger.log(`update order to approved`);
      await queryRunner.manager.update('orders', user_order.id, {
        is_approved: true,
        state: 'approved',
      });

      // push to order backlog as approved with order id and account id (admin)
      this.logger.log(`push to order backlog as approved`);
      await queryRunner.manager.insert('order_backlog', {
        state: 'approved',
        order: user_order.id,
        admin: adminId,
      });
      this.logger.log(`update account role to instructor`);
      await queryRunner.manager.update('accounts', user_order.account.id, {
        role: 'instructor',
      });

      this.logger.log('insert into instructor table');
      await queryRunner.manager.insert('instructor', {
        payment_info: user_order.payment_info,
        stripe_info: user_order.stripe_info,
        national_id: user_order.national_id,
        account: user_order.account.id,
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
