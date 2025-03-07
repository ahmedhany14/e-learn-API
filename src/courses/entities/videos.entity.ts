import {
    Entity
    , Column
    , PrimaryGeneratedColumn
    , JoinColumn
    , ManyToOne
} from 'typeorm';
import { Section } from './sections.entity';


@Entity()
export class Videos {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 256,
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 256,
    })
    video_url: string;

    @Column({ type: "varchar", unique: true })
    order: string

    @ManyToOne(() => Section, section => section.videos, {
        eager: true,
    })
    @JoinColumn({
        name: "section_id",
        referencedColumnName: "id"
    })
    section: Section;
}