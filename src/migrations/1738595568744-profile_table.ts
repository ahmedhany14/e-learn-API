import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class ProfileTable1738595568744 implements MigrationInterface {
  private readonly logger = new Logger(ProfileTable1738595568744.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating profile table');
    await queryRunner.query(`
        CREATE TABLE profile
        (
            id           SERIAL PRIMARY KEY,
            first_name   VARCHAR(16) NOT NULL,
            last_name    VARCHAR(16) NOT NULL,
            bio          varchar(256),
            phone_number VARCHAR(16) UNIQUE CHECK (phone_number ~ '^[0-9]{10,14}$'
        ) ,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            account_id INT          NOT NULL UNIQUE references account (id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);
    await queryRunner.query(`
              CREATE OR REPLACE FUNCTION update_profile_updated_at()
              RETURNS TRIGGER AS $$
              BEGIN
                  NEW.updated_at = NOW();
                  RETURN NEW;
              END;
              $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
              CREATE TRIGGER update_profile_timestamp
              BEFORE UPDATE ON profile
              FOR EACH ROW
              EXECUTE FUNCTION update_profile_updated_at();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping profile table');
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_profile_timestamp ON profile`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_profile_updated_at`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS profile`);
  }
}
