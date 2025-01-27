import {
  Entity,
  Column,
  Check,
  PrimaryGeneratedColumn, OneToOne,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';


@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 32,
    comment: "User's first name",
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 32,
    comment: "User's last name",
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
    comment: "User's bio",
  })
  bio: string;

  @Column({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Profile creation date',
  })
  created_at: Date;

  @Column({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Profile last update date'
  })
  updated_at: Date;

  @OneToOne(() => Account, (account) => account.profile)
  account: Account;
}