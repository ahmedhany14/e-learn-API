import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CreateProfile1738114721256 implements MigrationInterface {
  private readonly logger = new Logger(CreateProfile1738114721256.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating profile table');

    await queryRunner.manager.query(`
        CREATE TABLE "profile"
        (
            id           SERIAL PRIMARY KEY,
            "firstName"  VARCHAR(32) NOT NULL,
            "lastName"   VARCHAR(32) NOT NULL,
            "bio"        VARCHAR(256),
            phone_number VARCHAR(16) UNIQUE,
            created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CHECK (phone_number ~ '^[0-9]{10,16}$'
                )
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping profile table');
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
