import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Check,
  OneToOne,
} from 'typeorm';

import { Profile } from '../../profile/entity/profile.entity';
import { Order } from '../../orders/entity/order.entity';
import { Instructor } from '../../instructor/entity/instructor.entity';

@Entity()
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

  @OneToOne(() => Profile, (profile) => profile.account)
  profile: Profile;

  @OneToOne(() => Order, (order) => order.account, { lazy: true })
  order: Order;

  @OneToOne(() => Order, (order) => order.account, { lazy: true })
  backlog: Order;

  @OneToOne(() => Instructor, (instructor) => instructor.account, { lazy: true })
  instructor: Instructor;
}
