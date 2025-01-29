import {
  Entity,
  Column,
  Check,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';

@Entity()
@Check(`"phone_number" SIMILAR TO '^[0-9]{10,16}$'`) // will validate phone number, it should be between 10 and 16 digits
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

  @OneToOne(() => Account, (account) => account.profile, {
    onDelete: 'CASCADE',
  })
  account: Account;
}
