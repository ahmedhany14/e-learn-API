import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CourseStatusEnum } from '../enums/course.status.enum';
import { Account } from 'src/account/entity/account.entity';
import { Section } from '../../sections/entity/sections.entity';
import { CourseTags } from './course.tags.entity';

@Entity()
export class Course {
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
        default: 'draft',
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

    // plans (later)

    /*
     * Many to Many, where a course can be assigned to many tags and a tag can be assigned to many courses
     * Need normalization
     */
    // tags (later)
    @OneToMany(() => CourseTags, (courseTag) => courseTag.course, {
        lazy: true,
    })
    course_tags: Promise<CourseTags[]>;
}
