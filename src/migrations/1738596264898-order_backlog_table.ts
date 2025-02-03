import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class OrderBacklogTable1738596264898 implements MigrationInterface {
  private readonly logger = new Logger(OrderBacklogTable1738596264898.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating order_backlog table');

    await queryRunner.query(`
        CREATE TABLE order_backlog
        (
            id         SERIAL PRIMARY KEY,
            state      VARCHAR(255) NOT NULL CHECK (state IN ('pending', 'approved', 'rejected')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            order_id   INT          NOT NULL REFERENCES "orders" (id) ON DELETE CASCADE ON UPDATE CASCADE,
            admin_id INT          NOT NULL REFERENCES "account" (id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping order_backlog table');
    await queryRunner.query(`DROP TABLE IF EXISTS order_backlog`);
  }
}
