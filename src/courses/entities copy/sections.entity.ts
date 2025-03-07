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
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "course_id",
        referencedColumnName: "id"
    })
    course: number;

    @OneToMany(() => Videos, video => video.section, {
        cascade: true,
        onDelete: "CASCADE",
    })
    videos: number;

}

