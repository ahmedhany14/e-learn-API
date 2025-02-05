import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class AlterPlanColumnInCourse1738768837905
  implements MigrationInterface
{
  private readonly logger = new Logger(
    AlterPlanColumnInCourse1738768837905.name,
  );

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('alter plan column in course');
    await queryRunner.query(`
        ALTER TABLE courses
        DROP
        COLUMN plan;
    `);

    await queryRunner.query(`
        ALTER TABLE courses
            ADD COLUMN plan VARCHAR(16),
        ADD CONSTRAINT fk_plan FOREIGN KEY (plan) REFERENCES plans(plan_name)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('remove plan from courses');
    await queryRunner.query(`
        ALTER TABLE courses
        DROP
        COLUMN plan;
    `);

    await queryRunner.query(`
        ALTER TABLE courses
        DROP
        CONSTRAINT fk_plan;
    `);
  }
}
