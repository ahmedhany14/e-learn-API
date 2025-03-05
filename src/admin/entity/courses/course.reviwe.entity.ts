import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  Check,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('course_review')
export class CourseReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    comment:
      'contains time when the instructor submitted the review of the course',
  })
  created_at: Date;

  // relation with course, which course will be reviewed, one to one relation

  /*@OneToOne(() => Course, (course) => course.course_review, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  course: Course;*/
}
