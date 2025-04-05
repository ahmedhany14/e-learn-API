import {
    Column,
    Entity,
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

@Entity()
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

    @Column({
        type: 'varchar',
        default: 'No Title Provided',
        length: 124,
    })
    title: string;

    @Column({
        type: 'varchar',
        default: 'No Description Provided',
        comment: 'will be saved as a txt file not in the database',
    })
    description: string;

    @Column({
        type: 'varchar',
        default: 'No Requirements Provided',
        comment: 'will be saved as a txt file not in the database',
    })
    requirements: string;

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

    // one course can be enrolled by many accounts
    @OneToMany(() => EnrolledCourses, (enrolledCourses) => enrolledCourses.course, {
        lazy: true,
    })
    enrolled_courses: Promise<EnrolledCourses[]>;

    // plans (later)
}
