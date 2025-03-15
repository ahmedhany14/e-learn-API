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
        nullable: true
    })
    amount: number;

    @Column({
        type: 'varchar',
        length: 5,
        nullable: true
    })
    country: string;

    @Column({
        type: 'varchar',
        length: 3,
        nullable: true
    })
    currency: string;

    @Column({
        type: 'enum',
        enum: ['success', 'failed']
    })
    status: string;

    @Column({
        type: 'enum',
        default: 'stripe',
        enum: ['visa', 'mastercard', 'paypal', 'stripe']
    })
    payment_method: string;

    @Column({
        type: 'time with time zone',
        default: () => 'CURRENT_TIMESTAMP AT TIME ZONE'
    })
    payment_date: Date;

    @ManyToOne(() => Account, account => account.payments_history, {
        eager: true,
    })
    @JoinColumn({ name: 'account_id' })
    account: Account;
}