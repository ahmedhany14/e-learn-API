import { Account } from 'src/account/entity/account.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';


@Entity()
@Unique(['course', 'account'])
export class EnrolledCourses {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Course, course => course.enrolled_courses)
    @JoinColumn({
        name: 'course_id',
        referencedColumnName: 'id'
    })
    course: Course;

    @ManyToOne(() => Account, account => account.enrolled_courses)
    @JoinColumn({
        name: 'account_id',
        referencedColumnName: 'id'
    })
    account: Account;
}