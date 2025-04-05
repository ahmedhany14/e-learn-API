import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Videos } from '../../videos/entity/videos.entity';
import {AbstractEntity} from "y/abstract.db/abstract.entity";

@Entity()
export class Section extends AbstractEntity<Section>{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 256,
    })
    title: string;

    @Column({ type: 'int' })
    order: number;

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
