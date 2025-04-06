import { Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { AbstractEntity } from '@app/abstract.db/abstract.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Plan } from './plan.entity';

@Entity()
@Unique(['course', 'plan'])
export class CoursePlans extends AbstractEntity<CoursePlans> {
    @ManyToOne(() => Course, (course) => course.course_plans, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Plan, (plan) => plan.plan_courses, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;
}
