import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class InstructorCreate1738612057053 implements MigrationInterface {
  private readonly logger = new Logger(InstructorCreate1738612057053.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Creating Instructor table');
    await queryRunner.query(`
                CREATE TABLE instructor
                (
                    id           SERIAL PRIMARY KEY,
                    payment_info VARCHAR(124) NOT NULL,
                    stripe_info  VARCHAR(64)  NOT NULL,
                    national_id  VARCHAR(64)  NOT NULL,
                    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    update_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    account_id   INT          NOT NULL REFERENCES account (id) ON DELETE CASCADE ON UPDATE CASCADE,

                    UNIQUE (national_id, stripe_info, payment_info, account_id),
                    CHECK (payment_info ~ '^[0-9]{13,19}$'
                ) ,
        CHECK (stripe_info ~ '^acct_[a-zA-Z0-9]{16}$'),
        CHECK (national_id ~ '^[0-9]{10,14}$')
    );
      `);

    await queryRunner.query(`
        CREATE FUNCTION update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

    await queryRunner.query(`
        CREATE TRIGGER trigger_update_timestamp
        BEFORE UPDATE ON instructor
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Dropping Instructor table');
  }
}
