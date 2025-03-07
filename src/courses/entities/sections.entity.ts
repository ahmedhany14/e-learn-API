import {
    Entity
    , Column
    , PrimaryGeneratedColumn
    , JoinColumn
    , ManyToOne,
    OneToMany
} from 'typeorm';
import { Course } from './course.entity';
import { Videos } from './videos.entity';


@Entity()
export class Section {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 256,
    })
    title: string;

    @Column({ type: "varchar", unique: true })
    order: string;

    @ManyToOne(() => Course, course => course.sections, {
        eager: true,
    })
    @JoinColumn({
        name: "course_id",
        referencedColumnName: "id"
    })
    course: Course;

    @OneToMany(() => Videos, video => video.section, {
        lazy: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    videos: Promise<Videos[]>;
}

