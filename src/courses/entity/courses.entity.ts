import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn, OneToMany,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { Videos } from './videos.entity';

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

  // each course has many videos
  @OneToMany(() => Videos, (videos) => videos.course, {
    lazy: true,
  })
  videos: Promise<Videos[]>;

  // many courses can be created by the same instructor
  @ManyToOne(() => Account, (account) => account.courses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instructor_id' })
  instructor: Account;
}