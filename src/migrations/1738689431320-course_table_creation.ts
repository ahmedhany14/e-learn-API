import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CourseTableCreation1738689431320 implements MigrationInterface {
  private readonly logger = new Logger(CourseTableCreation1738689431320.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating course table');

    await queryRunner.query(
      `
          CREATE TABLE courses
          (
              id             SERIAL PRIMARY KEY,
              image_url      VARCHAR(256) NOT NULL,
              public         BOOLEAN                                                                                 DEFAULT FALSE,
              status         VARCHAR(16)  NOT NULL CHECK (status IN ('draft', 'published', 'archived', 'in_review')) DEFAULT 'draft',
              description    TEXT         NOT NULL,
              requirements   TEXT         NOT NULL,
              what_you_learn TEXT         NOT NULL,
              created_at     TIMESTAMP WITH TIME ZONE                                                                DEFAULT CURRENT_TIMESTAMP,
              instructor_id  INT UNIQUE   NOT NULL REFERENCES account (id) ON DELETE CASCADE
          )
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping course table');

    await queryRunner.query(`
        DROP TABLE IF EXISTS courses;
    `)
  }
}
