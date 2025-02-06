import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class AddPlanEndTimeToAccount1738780941525
  implements MigrationInterface
{
  private readonly logger = new Logger(
    AddPlanEndTimeToAccount1738780941525.name,
  );

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Add current_plan column in account table');
    await queryRunner.query(
      `
          ALTER TABLE account
              ADD COLUMN current_plan VARCHAR(16) NOT NULL DEFAULT 'free' REFERENCES plans (plan_name);
      `,
    );

    this.logger.log('Add plan_end_time column in account table');
    await queryRunner.query(
      `
          ALTER TABLE account
              ADD COLUMN plan_end_time TIMESTAMP WITH TIME ZONE default NULL;
      `,
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Drop current_plan column in account table');

    await queryRunner.query(
      `
          ALTER TABLE account DROP COLUMN current_plan;
      `,
    );

    this.logger.log('Drop plan_end_time column in account table');
    await queryRunner.query(
      `
          ALTER TABLE account DROP COLUMN plan_end_time;
      `,
    );
  }
}
