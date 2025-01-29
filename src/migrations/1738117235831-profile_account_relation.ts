import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class ProfileAccountRelation1738117235831 implements MigrationInterface {
  private readonly logger = new Logger(
    ProfileAccountRelation1738117235831.name,
  );

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Adding profileId column to account table');
    await queryRunner.query(`
        ALTER TABLE "account"
            ADD "profileId" integer
    `);

    this.logger.log('Creating profile_account relation with Cascade on delete');
    await queryRunner.query(`
        ALTER TABLE "account"
            ADD CONSTRAINT "FK_profile_account" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping profile_account relation');
    await queryRunner.query(`
        ALTER TABLE "account"
        DROP
        CONSTRAINT "FK_profile_account"
    `);
  }
}
