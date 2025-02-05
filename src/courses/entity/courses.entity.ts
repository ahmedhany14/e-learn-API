import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { Videos } from './videos.entity';
import { Plan } from './plan.entity';

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
    type: 'int',
    nullable: false,
    default: 0,
  })
  price: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Plan, (plan) => plan.courses, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'plan_name', referencedColumnName: 'plan_name' })
  plan: Plan;

  // each course has many videos
  @OneToMany(() => Videos, (videos) => videos.course, {
    lazy: true,
  })
  videos: Promise<Videos[]>;

  // many courses can be created by the same instructor
  @ManyToOne(() => Account, (account) => account.courses, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instructor_id' })
  instructor: Account;
}
