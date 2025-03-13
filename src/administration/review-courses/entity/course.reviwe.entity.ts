import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';

// enum for course review state
import { CourseReviewEnum } from '../enums/course.review.enum';

// import course entity to create one-to-one relation
import { Course } from '../../../courses/entities/course.entity';

@Entity('course_review')
@Unique(['state', 'course'])
export class CourseReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        enum: CourseReviewEnum,
        default: CourseReviewEnum.PENDING,
    })
    state: CourseReviewEnum;

    @Column({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'contains time when the instructor submitted the review of the course',
    })
    created_at: Date;

    // relation with course, which course will be reviewed, one-to-one relation
    @ManyToOne(() => Course, (course) => course.course_review, {
        eager: true,
        nullable: false,
    })
    @JoinColumn()
    course: Course;
}
