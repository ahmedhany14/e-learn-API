import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class AccoutTable1738594955490 implements MigrationInterface {
  private readonly logger = new Logger(AccoutTable1738594955490.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating account table');

    await queryRunner.query(`
        CREATE TABLE account
        (
            id    SERIAL PRIMARY KEY,
            email VARCHAR(64) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'
        ) ,
          password VARCHAR(124) NOT NULL,
          role VARCHAR(16) NOT NULL CHECK (role IN ('admin', 'user', 'instructor')) DEFAULT 'user',
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
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
      BEFORE UPDATE ON account
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping account table');
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_timestamp ON account`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
    await queryRunner.query(`DROP TABLE IF EXISTS account`);
  }
}
