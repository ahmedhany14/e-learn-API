import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { CourseTags } from './course.tags.entity';

@Entity()
@Unique(['category', 'subcategory', 'tag'])
export class Tags {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 32,
        nullable: false,
    })
    category: string;

    @Column({
        type: 'varchar',
        length: 32,
        nullable: false,
    })
    subcategory: string;

    @Column({
        type: 'varchar',
        length: 32,
        nullable: false,
    })
    tag: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    description: string;

    @ManyToOne(() => Account, (account) => account.tags, {
        nullable: false,
    })
    @JoinColumn({
        name: 'tag_creator_id',
        referencedColumnName: 'id',
    })
    tag_creator: Account;

    @OneToMany(() => CourseTags, (courseTag) => courseTag.tag, {
        lazy: true,
    })
    courseTags: Promise<CourseTags[]>;
}
