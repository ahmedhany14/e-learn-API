import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class PlansCreation1738768382464 implements MigrationInterface {
  private readonly logger = new Logger(PlansCreation1738768382464.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating plans table');

    await queryRunner.query(`
        CREATE TABLE plans
        (
            id            SERIAL PRIMARY KEY,
            plan_name     VARCHAR(16) UNIQUE NOT NULL,
            plan_price    INT                NOT NULL CHECK ( plan_price >= 0),
            plan_duration INT                NOT NULL CHECK (plan_duration >= 0),
            created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            admin_id      INT                NOT NULL REFERENCES "account" (id),
            updated_by    INT                NOT NULL REFERENCES "account" (id)
        )
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await queryRunner.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON plans
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping plans table');
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_timestamp ON plans`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
    await queryRunner.query(`DROP TABLE IF EXISTS plans`);
  }
}
