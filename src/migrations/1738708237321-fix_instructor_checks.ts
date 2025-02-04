import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class FixInstructorChecks1738708237321 implements MigrationInterface {
  private readonly logger = new Logger(FixInstructorChecks1738708237321.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Fixing Instructor table checks');
    await queryRunner.query(`
        ALTER TABLE instructor
            ADD CONSTRAINT unique_payment_info UNIQUE (payment_info);
    `);

    await queryRunner.query(`
        ALTER TABLE instructor
            ADD CONSTRAINT unique_stripe_info UNIQUE (stripe_info);
    `);

    await queryRunner.query(`
        ALTER TABLE instructor
            ADD CONSTRAINT unique_national_id UNIQUE (national_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Reverting Instructor table checks');

    await queryRunner.query(`
        ALTER TABLE instructor
        DROP
        CONSTRAINT unique_payment_info;
    `);

    await queryRunner.query(`
        ALTER TABLE instructor
        DROP
        CONSTRAINT unique_stripe_info;
    `);

    await queryRunner.query(`
        ALTER TABLE instructor
        DROP
        CONSTRAINT unique_national_id;
    `);
  }
}
