import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { Plan_Account } from '../../account/entity/account.plan.entity';

@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 16,
        nullable: false,
        unique: true,
    })
    plan_name: string;

    @Column({
        type: 'float',
        nullable: false,
        default: 0,
    })
    plan_price: number;

    @Column({
        type: 'int',
        nullable: false,
        default: 0,
    })
    plan_duration: number;


    @Column({
        type: 'text',
        nullable: true,
    })
    plan_description: string;

    @Column({
        type: 'boolean',
        nullable: false,
        default: true,
    })
    is_active: boolean;

    @Column({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @Column({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

    @OneToMany(() => Plan_Account, (plan_account) => plan_account.plan, {
        lazy: true,
    })
    plans_account: Promise<Plan_Account[]>;

    // each plan is created by an admin, and multiple plans can be created by the same admin
    @ManyToOne(() => Account, (account) => account.plans, {
        nullable: false,
    })
    @JoinColumn({ name: 'admin_id' })
    admin: Account;

    // each plan can be updated by an admin, and multiple plans can be updated by the same admin
    @ManyToOne(() => Account, (account) => account.plans_updated, {
        nullable: false,
    })
    @JoinColumn({ name: 'updated_by_id' })
    updated_by: Account;
}
