import {
  Entity,
  Column,
  Check,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';

@Entity()
//@Check(`"phone_number" SIMILAR TO '^[0-9]{10,16}$'`) // will validate phone number, it should be between 10 and 16 digits
@Unique(['account']) // add unique constraint to the phone_number column
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 16,
    comment: "User's first name",
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 16,
    comment: "User's last name",
  })
  last_name: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
    comment: "User's bio",
  })
  bio: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: "User's phone number",
    unique: true,
  })
  phone_number: string;

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
    comment: 'Profile last update date',
  })
  updated_at: Date;

  // One profile can have one account
  @OneToOne(() => Account, (account) => account.profile, {
    eager: true,
    cascade: ['remove'],
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
