import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { Course } from './courses.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    unique: true,
  })
  plan_name: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  plan_price: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  plan_duration: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Course, (course) => course.plan, {})
  courses: Promise<Course[]>;

  @ManyToOne(() => Account, (account) => account.plans, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'admin_id' })
  admin_id: Account;

  @ManyToOne(() => Account, (account) => account.plans_updated, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'updated_by' })
  updated_by: Account;
}
