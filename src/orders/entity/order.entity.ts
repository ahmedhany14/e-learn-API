import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { OrderBacklog } from './order.backlog.entity';

@Entity('orders')
@Unique(['national_id', 'payment_info', 'stripe_info', 'account'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 124,
    nullable: false,
    comment: 'User Payment Information',
  })
  payment_info: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'Stripe Payment Information',
  })
  stripe_info: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'User National ID',
  })
  national_id: string;

  @Column({
    type: 'varchar',
    length: 64,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    nullable: false,
    comment: 'Order statues',
  })
  state: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: () => 'false',
    comment: 'Order approval status',
  })
  is_approved: boolean;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Order creation date',
  })
  created_at: Date;

  @OneToOne(() => OrderBacklog, (orderBacklog) => orderBacklog.order, {})
  backlog: OrderBacklog;

  @OneToOne(() => Account, (account) => account.order, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'account_id',
    referencedColumnName: 'id',
  })
  account: Account;
}
