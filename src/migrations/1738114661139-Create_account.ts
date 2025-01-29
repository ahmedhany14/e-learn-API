import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccount1738114661139 implements MigrationInterface {
  private readonly logger = new Logger(CreateAccount1738114661139.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating account table');

    await queryRunner.query(`
        CREATE TABLE "account"
        (
            "id"        SERIAL PRIMARY KEY,
            "email"     VARCHAR(64)              NOT NULL UNIQUE,
            "password"  VARCHAR(124)             NOT NULL,
            "role"      VARCHAR(16)              NOT NULL DEFAULT 'user',
            "isActive"  BOOLEAN                  NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CHECK ( "role" IN ('admin', 'user', 'instructor', 'guest') ),
            CHECK ( "email" ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        )
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping account table');
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
