import {
    Entity
    , Column
    , PrimaryGeneratedColumn
    , JoinColumn
    , ManyToOne
} from 'typeorm';
import { Section } from './sections.entity';


@Entity()
export class Video {

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
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "section_id",
        referencedColumnName: "id"
    })
    section: number;
}