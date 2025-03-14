import { Account } from 'src/account/entity/account.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class PaymentsHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    amount: number;

    @Column({
        type: 'varchar',
        length: 5
    })
    country: string;

    @Column({
        type: 'varchar',
        length: 3
    })
    currency: string;

    @Column({
        type: 'enum',
        enum: ['success', 'failed']
    })
    status: string;

    @ManyToOne(() => Account, account => account.payments_history, {
        eager: true,
    })
    @JoinColumn({ name: 'account_id' })
    account: Account;
}