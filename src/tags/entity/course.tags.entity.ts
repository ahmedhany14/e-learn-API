import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Course } from '../../courses/entity/courses.entity';
import { Tags } from './tags.entity';

@Entity()
@Unique(['course', 'tag'])
export class CourseTags {
  @PrimaryGeneratedColumn()
  id: number;

  // relation with course and tags, where course can have multiple tags, and tags can be in multiple courses
  @ManyToOne(() => Course, (course) => course.tags, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
  })
  course: Course;

  // relation with course and tags, where tags can be in multiple courses, and course can have multiple tags
  @ManyToOne(() => Tags, (tags) => tags.course, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({
  })
  tag: Course;
}
