import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tags } from '../../tags/entity/tags.entity';
import { Course } from './course.entity';

@Entity()
export class CourseTags {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Course, (course) => course.course_tags, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id', referencedColumnName: 'id' })
    course: Course;

    @ManyToOne(() => Tags, (tag) => tag.courseTags, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tags;
}
