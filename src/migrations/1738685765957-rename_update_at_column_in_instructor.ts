import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class RenameUpdateAtColumnInInstructor1738685765957
  implements MigrationInterface
{
  private readonly logger = new Logger(
    RenameUpdateAtColumnInInstructor1738685765957.name,
  );

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Renaming update_at column to updated_at');
    await queryRunner.query(`
        ALTER TABLE instructor
            RENAME COLUMN update_at TO updated_at;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('reverse renaming updated_at column to update_at');
    await queryRunner.query(`
        ALTER TABLE instructor
            RENAME COLUMN updated_at TO update_at;
    `);
  }
}
