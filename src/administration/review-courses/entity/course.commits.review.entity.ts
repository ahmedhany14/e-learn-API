import { AbstractEntity } from '@app/abstract.db/abstract.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';

export enum CourseCommitsReviewStateEnum {
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
}


@Entity('course_commits_review')
export class CourseCommitsReview extends AbstractEntity<CourseCommitsReview> {

    @Column({
        type: 'varchar',
        nullable: true,
    })
    title?: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    requirements?: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    what_you_learn?: string;

    @Column({
        type: 'decimal',
        nullable: true,
    })
    price?: number;


    @Column({
        type: 'enum',
        enum: CourseCommitsReviewStateEnum,
        default: CourseCommitsReviewStateEnum.PENDING,
        nullable: false,
    })
    state: CourseCommitsReviewStateEnum;

    @ManyToOne(() => Course, (course) => course.course_commits_review, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true,
    })
    @JoinColumn({ name: 'course_id' })
    course: Course
}