import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Account } from '../../../account/entity/account.entity';

@Entity()
@Unique(['order', 'admin'])
export class OrderBacklog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 124,
    nullable: false,
    enum: ['approved', 'rejected'],
  })
  state: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Order creation date',
  })
  created_at: Date;

  // one order can have one backlog
  @OneToOne(() => Order, (order) => order.backlog, {
    // eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

  // one admin can have many backlogs
  @ManyToOne(() => Account, (account) => account.backlog, {
    // eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  admin: Account;
}
