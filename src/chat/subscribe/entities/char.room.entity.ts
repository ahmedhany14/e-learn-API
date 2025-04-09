import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';

import { Account } from '../../../account/entity/account.entity';
import { AbstractEntity } from '@app/abstract.db';
import { RoomSubscribers } from './room.subscribers.entity';

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

    @OneToMany(() => RoomSubscribers, (room_subscribers) => room_subscribers.room, {
        lazy: true,
    })
    room_subscribers: Promise<RoomSubscribers[]>;
}
