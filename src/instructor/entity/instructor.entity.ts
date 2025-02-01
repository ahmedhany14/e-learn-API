import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Profile } from '../../profile/entity/profile.entity';
import { Account } from '../../account/entity/account.entity';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 124,
    nullable: false,
  })
  PaymentInfo: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  stripeInfo: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  nationalId: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  cratedAt: Date;

  @Column({
    type: 'time with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @OneToOne(() => Account, (account) => account.instructor, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id',
  })
  account: Account;
}
