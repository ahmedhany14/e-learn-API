import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Videos } from '../../videos/entity/videos.entity';

@Entity()
@Unique(['order', 'course'])
export class Section {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 256,
    })
    title: string;

    @Column({ type: 'varchar', unique: true })
    order: string;

    @ManyToOne(() => Course, (course) => course.sections, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'course_id',
        referencedColumnName: 'id',
    })
    course: Course;

    @OneToMany(() => Videos, (video) => video.section, {
        lazy: true,
    })
    videos: Promise<Videos[]>;
}
