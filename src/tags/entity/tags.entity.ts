import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  ManyToMany, OneToMany,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { CourseTags } from './course.tags.entity';

@Entity()
@Unique(['category', 'subcategory', 'tag'])
export class Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    comment: 'category of the tage like dev, design, marketing, etc',
  })
  category: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    comment: 'subcategory of the tag like web, mobile, ai, etc',
  })
  subcategory: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    comment: 'tag name like angular, react, vue, etc',
  })
  tag: string;

  @ManyToOne(() => Account, (account) => account.tags)
  @JoinColumn({ name: 'tag_creator_id' })
  tag_creator: Account;

  @OneToMany(() => CourseTags, (courseTags) => courseTags.tag, {
    lazy: true,
  })
  course: Promise<CourseTags[]>;
}
