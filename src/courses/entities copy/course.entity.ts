import {
    Entity
    , Column
    , PrimaryGeneratedColumn
    , OneToOne
    , JoinColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { CourseStatusEnum } from '../enums/course.status.enum';
import { Account } from 'src/account/entity/account.entity';
import { Section } from './sections.entity';


@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        default: "default.jpg",
        nullable: true,
        length: 256,
    })
    image_url: string;

    @Column({
        type: "varchar",
        default: "No Title Provided",
        length: 124,
    })
    title: string;

    @Column({
        type: "varchar",
        default: "No Description Provided",
        comment: "will be saved as a txt file not in the database",
    })
    description: string;

    @Column({
        type: "varchar",
        default: "No Requirements Provided",
        comment: "will be saved as a txt file not in the database",
    })
    requirements: string;

    @Column({
        type: "varchar",
        default: "No What You Learn Provided",
        comment: "will be saved as a txt file not in the database",
    })
    what_you_learn: string;

    @Column({
        type: "enum",
        default: "draft",
        length: 32,
    })
    state: CourseStatusEnum;

    @Column({
        type: "decimal",
        default: 0,
        precision: 10,
        scale: 2,
    })
    price: number;

    @Column({
        type: "int",
        default: 0,
    })
    views: number;

    @Column({
        type: "decimal",
        default: 0,
        precision: 10,
        scale: 2,
    })
    rate: number;

    @ManyToOne(() => Account, (account) => account.courses, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "instructor_id",
        referencedColumnName: "id",
    })
    instructor: string;

    // one course can have many sections

    @OneToMany(() => Section, (section) => section.course, {
        lazy: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    sections: Promise<Section[]>;

    // plans (later)

    // tags (later)
}