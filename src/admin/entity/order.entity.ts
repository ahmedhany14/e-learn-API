import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';

@Entity()
@Unique(['nationalId', 'PaymentInfo', 'account'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 124,
    nullable: false,
    comment: 'User Payment Information',
  })
  PaymentInfo: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'User National ID',
  })
  nationalId: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: 'Stripe Payment Information',
  })
  stripeInfo: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Order creation date',
  })
  createdAt: Date;

  @Column({
    type: 'boolean',
    nullable: false,
    default: () => 'false',
    comment: 'Order approval status',
  })
  isApproved: boolean;

  @OneToOne(() => Account, (account) => account.order, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  account: Account;
}
