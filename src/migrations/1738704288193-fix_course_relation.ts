import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class FixCourseRelation1738704288193 implements MigrationInterface {
  private readonly logger = new Logger(FixCourseRelation1738704288193.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Fixing course relation');
    await queryRunner.query(`
        ALTER TABLE courses DROP CONSTRAINT courses_instructor_id_key;
    `);

    await queryRunner.query(`
        ALTER TABLE courses DROP CONSTRAINT courses_instructor_id_fkey;
    `);

    await queryRunner.query(`
        ALTER TABLE courses
            ADD CONSTRAINT courses_instructor_id_fkey
                FOREIGN KEY (instructor_id) REFERENCES account (id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Reverting course relation');
    await queryRunner.query(`
        ALTER TABLE courses DROP CONSTRAINT courses_instructor_id_fkey;
    `);

    await queryRunner.query(`
        ALTER TABLE courses
            ADD CONSTRAINT courses_instructor_id_key UNIQUE (instructor_id);
    `);

    await queryRunner.query(`
        ALTER TABLE courses
            ADD CONSTRAINT courses_instructor_id_fkey
                FOREIGN KEY (instructor_id) REFERENCES account (id) ON DELETE CASCADE;
    `);
  }
}
