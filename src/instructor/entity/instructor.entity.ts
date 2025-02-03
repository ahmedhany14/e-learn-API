import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne, Unique,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';

@Entity('instructor')
@Unique(['national_id', 'stripe_info', 'payment_info', 'account'])
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 124,
    nullable: false,
  })
  payment_info: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  stripe_info: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  national_id: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'time with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToOne(() => Account, (account) => account.instructor, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'account_id',
    referencedColumnName: 'id',
  })
  account: Account;
}
