import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Section } from '../../sections/entity/sections.entity';

@Entity()
//@Unique(['order', 'section'])
@Unique(['video_url', 'section'])
export class Videos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 256,
    })
    title: string;

    @Column({
        type: 'int',
        default: 0,
    })
    duration: number;

    @Column({
        type: 'varchar',
        length: 256,
    })
    video_url: string;

    @Column({ type: 'int' })
    order: number;

    @ManyToOne(() => Section, (section) => section.videos, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'section_id',
        referencedColumnName: 'id',
    })
    section: Section;
}
