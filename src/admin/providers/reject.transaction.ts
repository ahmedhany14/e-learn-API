import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class RejectTransaction {
  constructor(private readonly dataSource: DataSource) {}

  async rejectOrder(orderId: number, adminId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update('order', orderId, {
        isApproved: false,
        state: 'rejected',
      });

      await queryRunner.manager.insert('order_backlog', {
        state: 'rejected',
        order: orderId,
        account: adminId,
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
