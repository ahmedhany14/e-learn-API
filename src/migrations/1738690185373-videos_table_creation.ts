import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class VideosTableCreation1738690185373 implements MigrationInterface {
  private readonly logger = new Logger(VideosTableCreation1738690185373.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating videos table');
    await queryRunner.query(
      `
          CREATE TABLE videos
          (
              id         SERIAL PRIMARY KEY,
              url        TEXT         NOT NULL,
              title      VARCHAR(255) NOT NULL,
              section    VARCHAR(124) NOT NULL,
              duration   INT          NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              course_id  INT          NOT NULL REFERENCES courses (id) ON DELETE CASCADE
          )
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping videos table');
    await queryRunner.query(
      `
          DROP TABLE IF EXISTS videos;
      `
    );
  }
}
