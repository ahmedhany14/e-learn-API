import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseStatusEnum } from '../enums/course.status.enum';
import { Account } from 'src/account/entity/account.entity';
import { Section } from '../../sections/entity/sections.entity';
import { CourseTags } from '../../tags/entity/course.tags.entity';
import { CourseReview } from '../../administration/review-courses/entity/course.reviwe.entity';
import { EnrolledCourses } from 'src/payments/modules/enroll-courses/entity/enrolled.courses.entity';
import { AbstractEntity } from '@app/abstract.db/abstract.entity';
import { CourseCommitsReview } from 'src/administration/course_commits/entity/course.commits.review.entity';
import { CoursePlans } from '../../plans/entity/course.plan.entity';

@Entity()
@Index('idx_course_search', ['title', 'description', 'requirements', 'what_you_learn'])
export class Course extends AbstractEntity<Course> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        default: 'default.jpg',
        nullable: true,
        length: 256,
    })
    image_url: string;

    @Index('idx_course_title')
    @Column({
        type: 'varchar',
        default: 'No Title Provided',
        length: 124,
    })
    title: string;

    @Index('idx_course_description')
    @Column({
        type: 'varchar',
        default: 'No Description Provided',
        comment: 'will be saved as a txt file not in the database',
    })
    description: string;

    @Index('idx_course_requirements')
    @Column({
        type: 'varchar',
        default: 'No Requirements Provided',
        comment: 'will be saved as a txt file not in the database',
    })
    requirements: string;

    @Index('idx_course_what_you_learn')
    @Column({
        type: 'varchar',
        default: 'No What You Learn Provided',
        comment: 'will be saved as a txt file not in the database',
    })
    what_you_learn: string;

    @Column({
        type: 'enum',
        default: CourseStatusEnum.DRAFT,
        enum: CourseStatusEnum,
    })
    state: CourseStatusEnum;

    @Column({
        type: 'decimal',
        default: 0,
        precision: 10,
        scale: 2,
    })
    price: number;

    @Column({
        type: 'int',
        default: 0,
    })
    views: number;

    @Column({
        type: 'decimal',
        default: 0,
        precision: 10,
        scale: 2,
    })
    rate: number;

    @ManyToOne(() => Account, (account) => account.courses, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'instructor_id',
        referencedColumnName: 'id',
    })
    instructor: Course;

    // one course can have many sections
    @OneToMany(() => Section, (section) => section.course, {
        lazy: true,
    })
    sections: Promise<Section[]>;

    /*
     * Many to Many, where a course can be assigned to many tags and a tag can be assigned to many courses
     * Need normalization
     */
    @OneToMany(() => CourseTags, (courseTag) => courseTag.course, {
        lazy: true,
    })
    course_tags: Promise<CourseTags[]>;

    /*
     * one course can have many reviews
     * it seems strange, but it is possible
     * when course reviewed, and it is not approved, and the instructor updated the course.
     * There will be a new review, so the course can have many reviews
     */
    @OneToMany(() => CourseReview, (courseReview) => courseReview.course, {
        lazy: true,
    })
    course_review: Promise<CourseReview[]>;

    // one course can have many commits reviews
    @OneToMany(() => CourseCommitsReview, (courseCommitsReview) => courseCommitsReview.course, {
        lazy: true,
    })
    course_commits_review: Promise<CourseCommitsReview[]>;

    // one course can be enrolled by many accounts
    @OneToMany(() => EnrolledCourses, (enrolledCourses) => enrolledCourses.course, {
        lazy: true,
    })
    enrolled_courses: Promise<EnrolledCourses[]>;

    // one course can have many plans
    @OneToMany(() => CoursePlans, (coursePlans) => coursePlans.course, {
        lazy: true,
    })
    course_plans: Promise<CoursePlans[]>;
}
