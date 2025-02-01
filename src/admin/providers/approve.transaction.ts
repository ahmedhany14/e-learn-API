import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ApproveTransaction {
  constructor(private readonly dataSource: DataSource) {}

  async approveOrder(orderId: number, adminId: number, userAccountId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // edit order as approved
      await queryRunner.manager.update('order', orderId, { isApproved: true });

      // push to order backlog as approved with order id and account id (admin)
      await queryRunner.manager.insert('order_backlog', {
        state: 'approved',
        order: orderId,
        account: adminId,
      });

      await queryRunner.manager.update('account', userAccountId, {
        role: 'instructor',
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('An unexpected error occurred');
    } finally {
      await queryRunner.release();
    }
  }
}
