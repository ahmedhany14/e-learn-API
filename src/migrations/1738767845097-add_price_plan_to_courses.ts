import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class AddPricePlanToCourses1738767845097 implements MigrationInterface {
  private readonly logger = new Logger(AddPricePlanToCourses1738767845097.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('add price column to courses');

    await queryRunner.query(`
        ALTER TABLE courses
            ADD COLUMN price INT CHECK (price >= 0) DEFAULT 0
    `);

    this.logger.log('add plan column to courses');

    await queryRunner.query(`
        ALTER TABLE courses
            ADD COLUMN plan VARCHAR(255) DEFAULT 'free' CHECK (plan IN ('free', 'yearly', 'monthly', 'business'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('remove price and plan from courses');

    await queryRunner.query(`
        ALTER TABLE courses
        DROP
        COLUMN price,
            DROP
        COLUMN plan;
    `);
  }
}
