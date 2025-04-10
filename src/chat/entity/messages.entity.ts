import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';

import { AbstractEntity } from '@app/abstract.db';
import { ChatRoom } from '../subscribe/entities/char.room.entity';

@Entity()
export class Messages extends AbstractEntity<Messages> {
    @Column({
        type: 'varchar',
        nullable: false,
    })
    content: string;

    @Column({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'chat_room_id' })
    chat_room: ChatRoom;
}
