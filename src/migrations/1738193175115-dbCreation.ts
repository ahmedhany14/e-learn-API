import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class DbCreation1738193175115 implements MigrationInterface {
  private readonly logger = new Logger(DbCreation1738193175115.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating tables');
    const dbExists = await queryRunner.manager.query(
      `SELECT 1
       FROM pg_database
       WHERE datname = 'e_learn_platformdb'`
    );

    if (dbExists.length === 0) {
      await queryRunner.manager.query(`CREATE DATABASE e_learn_platformdb`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping tables');
    await queryRunner.manager.query(
      'DROP DATABASE IF EXISTS e_learn_platformdb',
    );
  }
}
