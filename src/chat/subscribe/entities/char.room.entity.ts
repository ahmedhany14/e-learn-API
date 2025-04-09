import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';

import { Account } from '../../../account/entity/account.entity';
import { AbstractEntity } from '@app/abstract.db';

@Entity()
export class ChatRoom extends AbstractEntity<ChatRoom> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        nullable: false,
        unique: true,
        comment: 'Chat room ID',
    })
    room_id: number;

    @Column({
        type: 'varchar',
        length: 64,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 256,
    })
    description: string;

    @Column({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Room creation date',
    })
    created_at: Date;

    @OneToOne(() => Account, (account) => account.instructor_room, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'instructor_id',
    })
    instructor: Account;
}
