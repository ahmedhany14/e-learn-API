import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class OrderTable1738595839996 implements MigrationInterface {
  private readonly logger = new Logger(OrderTable1738595839996.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating order table');
    await queryRunner.query(`
        CREATE TABLE orders
        (
            id           SERIAL PRIMARY KEY,
            payment_info VARCHAR(255) NOT NULL CHECK (payment_info ~ '^[0-9]{13,19}$'
        ) ,
            stripe_info  VARCHAR(255) NOT NULL CHECK (stripe_info ~ '^acct_[a-zA-Z0-9]{16}$'),
            national_id  VARCHAR(255) NOT NULL CHECK (national_id ~ '^[0-9]{10,14}$'),
            state        VARCHAR(255) NOT NULL CHECK (state IN ('pending', 'approved', 'rejected')),
            is_approved  BOOLEAN DEFAULT FALSE,
            created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            account_id   INT          NOT NULL REFERENCES "account" (id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping order table');
    await queryRunner.query(`DROP TABLE IF EXISTS orders`);
  }
}
