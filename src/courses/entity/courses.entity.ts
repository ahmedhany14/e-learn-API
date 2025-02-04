import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  image_url: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  public: boolean;

  @Column({
    type: 'varchar',
    length: 16,
    enum: ['draft', 'published', 'archived', 'in_review'],
    nullable: false,
  })
  status: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  requirements: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  what_you_learn: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Account, (account) => account.courses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instructor_id' })
  instructor: Account;
}