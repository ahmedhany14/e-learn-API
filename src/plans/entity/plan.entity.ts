import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Account } from '../../account/entity/account.entity';
import { AccountSubscriptions } from '../../payments/modules/subscriptions/entity/account.plan.entity';
import { AbstractEntity } from '@app/abstract.db/abstract.entity';
import { CoursePlans } from './course.plan.entity';

@Entity('plans')
export class Plan extends AbstractEntity<Plan> {
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

    @OneToMany(() => AccountSubscriptions, (accountSubscriptions) => accountSubscriptions.plan, {
        lazy: true,
    })
    plans_account: Promise<AccountSubscriptions[]>;

    // each plan is created by an admin, and multiple plans can be created by the same admin
    @ManyToOne(() => Account, (account) => account.plans, {
        eager: true,
        nullable: false,
    })
    @JoinColumn({ name: 'admin_id' })
    admin: Account;

    // each plan can be updated by an admin, and multiple plans can be updated by the same admin
    @ManyToOne(() => Account, (account) => account.plans_updated, {
        eager: true,
        //nullable: false,
    })
    @JoinColumn({ name: 'updated_by_id' })
    updated_by: Account;

    // each plan can have multiple courses, and each course can belong to multiple plans
    @OneToMany(() => CoursePlans, (course_plan) => course_plan.plan, {
        lazy: true,
    })
    plan_courses: Promise<CoursePlans[]>;
}
