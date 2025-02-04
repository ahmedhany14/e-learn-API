import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from './courses.entity';

@Entity('videos')
export class Videos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  video_url: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 124,
    nullable: false,
  })
  section: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  duration: number;

  @ManyToOne(() => Course, (course) => course.videos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
