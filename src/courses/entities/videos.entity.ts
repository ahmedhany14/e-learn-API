import {
    Entity
    , Column
    , PrimaryGeneratedColumn
    , JoinColumn
    , ManyToOne, Unique,
} from 'typeorm';
import { Section } from './sections.entity';


@Entity()
@Unique(["order", "section"])
export class Videos {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 256,
    })
    title: string;

    @Column({
        type: "int",
        default: 0,
    })
    duration: number;

    @Column({
        type: 'varchar',
        length: 256,
        unique: true,
    })
    video_url: string; 10

    @Column({ type: "varchar", unique: true })
    order: string

    @ManyToOne(() => Section, section => section.videos, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "section_id",
        referencedColumnName: "id"
    })
    section: Section;
}