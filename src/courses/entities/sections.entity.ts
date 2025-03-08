import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Videos } from './videos.entity';
import { Unique } from 'typeorm/browser';

@Entity()
@Unique(['order', 'course'])
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
  })
  title: string;

  @Column({ type: 'varchar', unique: true })
  order: string;

  @ManyToOne(() => Course, (course) => course.sections, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'course_id',
    referencedColumnName: 'id',
  })
  course: Course;

  @OneToMany(() => Videos, (video) => video.section, {
    lazy: true,
  })
  videos: Promise<Videos[]>;
}
