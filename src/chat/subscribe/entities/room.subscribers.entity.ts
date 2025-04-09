import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '@app/abstract.db';
import { Unique } from 'typeorm';
import { ChatRoom } from './char.room.entity';
import { Account } from '../../../account/entity/account.entity';

@Entity()
@Unique(['room', 'subscriber'])
export class RoomSubscribers extends AbstractEntity<RoomSubscribers> {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ChatRoom, (charRoom) => charRoom.room_subscribers, {
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'room_id',
        referencedColumnName: 'id',
    })
    room: ChatRoom;

    @ManyToOne(() => Account, (account) => account.room_subscriptions, {
        eager: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'subscriber_id',
        referencedColumnName: 'id',
    })
    subscriber: Account;
}
