import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Order } from './order.entity';
import { Account } from '../../account/entity/account.entity';

@Entity()
@Unique(['order', 'account'])
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
  createdAt: Date;

  @OneToOne(() => Order, (order) => order.backlog, {
    // eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

  @OneToOne(() => Account, (account) => account.backlog, {
    // eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  account: Account;
}
