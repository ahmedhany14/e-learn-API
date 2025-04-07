import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Account } from '../../../../account/entity/account.entity';
import { Plan } from '../../../../plans/entity/plan.entity';
import { AbstractEntity } from '@app/abstract.db/abstract.entity';

@Entity()
export class AccountSubscriptions extends AbstractEntity<AccountSubscriptions> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    start_at: Date;

    @Column({
        type: 'timestamp with time zone',
        nullable: false,
    })
    end_at: Date;

    // each account can have multiple plans, and each plan can be assigned to multiple accounts
    @ManyToOne(() => Account, (account) => account.plans_account, {
        eager: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    // each plan can be assigned to multiple accounts, and each account can have multiple plans
    @ManyToOne(() => Plan, (plan) => plan.plans_account, {
        eager: true,
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;
}
