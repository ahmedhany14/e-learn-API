import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Check,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Profile } from '../../profile/entity/profile.entity';
import { Order } from '../../orders/entity/order.entity';
import { Instructor } from '../../instructor/entity/instructor.entity';
import { OrderBacklog } from '../../orders/entity/order.backlog.entity';
import { Course } from '../../courses/entity/courses.entity';
import { Plan } from '../../courses/entity/plan.entity';


@Entity('account')
@Check(`"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`)
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
    comment: "User's email",
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 124,
    nullable: false,
    comment: "User's password",
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    default: 'user',
    enum: ['admin', 'user', 'instructor', 'guest'],
    comment: "User's role",
  })
  role: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: () => 'true',
    comment: `user's account status, true if active, false if inactive`,
  })
  is_active: boolean;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Account creation date',
  })
  created_at: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Account last update date',
  })
  updated_at: Date;

  // each account has one profile
  @OneToOne(() => Profile, (profile) => profile.account,{
    lazy: true,
  })
  profile: Promise<Profile>;

  // each account can be assigned to one instructor
  @OneToOne(() => Instructor, (instructor) => instructor.account, {
    lazy: true,
  })
  instructor: Promise<Instructor>;

  // each user can have one order to be instructor
  @OneToMany(() => Order, (order) => order.account, { lazy: true })
  order: Promise<Order[]>;

  // each admin can review multiple orders and add them to the backlog
  @OneToMany(() => OrderBacklog, (orderBacklog) => orderBacklog.admin, {
    lazy: true,
  })
  backlog: Promise<OrderBacklog[]>;

  // each instructor can have multiple courses
  @OneToMany(() => Course, (course) => course.instructor, {
    lazy: true,
  })
  courses: Promise<Course[]>;

  @OneToMany(() => Plan, (plan) => plan.admin_id, {
    lazy: true,
  })
  plans: Promise<Plan[]>;

  @OneToMany(() => Plan, (plan) => plan.updated_by, {
    lazy: true,
  })
  plans_updated: Promise<Plan[]>;
}
