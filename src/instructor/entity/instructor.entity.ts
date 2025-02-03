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
  Payment_info: string;

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
  crated_at: Date;

  @Column({
    type: 'time with time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  update_at: Date;

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
