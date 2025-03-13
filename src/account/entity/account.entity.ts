import { Check, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Profile } from '../../profile/entity/profile.entity';
import { Order } from '../../orders/entity/order.entity';
import { Instructor } from '../../instructor/entity/instructor.entity';
import { OrderBacklog } from '../../orders/entity/order.backlog.entity';
import { Plan } from '../../plans/entity/plan.entity';
import { Plan_Account } from './account.plan.entity';
import { RoleEnum } from '../../auth/enums/role.enum';
import { Course } from '../../courses/entities/course.entity';
import { Tags } from '../../tags/entity/tags.entity';

@Entity({
    name: 'accounts',
    orderBy: {
        created_at: 'ASC',
    },
    comment: 'User accounts',
})
@Check(`"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`)
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 64,
        nullable: false,
        unique: true,
        comment: "User's email",
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 124,
        nullable: true,
        comment: "User's password",
        select: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 16,
        nullable: false,
        default: 'user',
        enum: RoleEnum,
        comment: "User's role",
    })
    role: RoleEnum;

    @Column({
        type: 'boolean',
        nullable: false,
        default: () => 'false',
        comment: `user's account status, true if active, false if inactive`,
    })
    is_active: boolean;

    @Column({
        type: 'boolean',
        nullable: false,
        default: () => 'false',
        comment: 'User has been banned by the admin or not?',
    })
    has_been_banned: boolean;

    @Column({
        type: 'timestamp with time zone',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Account creation date',
    })
    created_at: Date;

    @Column({
        type: 'timestamp with time zone',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        comment: 'Account last update date',
    })
    updated_at: Date;

    // each account has one profile
    @OneToOne(() => Profile, (profile) => profile.account, {
        lazy: true,
    })
    profile: Promise<Profile>;

    // each account can be assigned to one instructor
    @OneToOne(() => Instructor, (instructor) => instructor.account, {
        lazy: true,
    })
    instructor: Promise<Instructor>;

    // each instructor can have multiple courses
    @OneToMany(() => Course, (course) => course.instructor, {
        lazy: true,
    })
    courses: Promise<Course[]>;

    // each account can have multiple tags
    @OneToMany(() => Tags, (tags) => tags.tag_creator, {
        lazy: true,
    })
    tags: Promise<Tags[]>;

    // each user can have one order to be instructor
    @OneToMany(() => Order, (order) => order.account, {
        lazy: true,
    })
    order: Promise<Order[]>;

    // each account can have multiple plans, but if the account activates a plan, he can't activate it again until it expires
    @OneToMany(() => Plan_Account, (plan_account) => plan_account.account, {
        lazy: true,
    })
    plans_account: Promise<Plan_Account[]>;

    // each admin can review multiple orders and add them to the backlog
    @OneToMany(() => OrderBacklog, (orderBacklog) => orderBacklog.admin, {
        lazy: true,
    })
    backlog: Promise<OrderBacklog[]>;

    // each admin can create multiple plans
    @OneToMany(() => Plan, (plan) => plan.admin, {
        lazy: true,
    })
    plans: Promise<Plan[]>;

    // each admin can update multiple plans
    @OneToMany(() => Plan, (plan) => plan.updated_by, {
        lazy: true,
    })
    plans_updated: Promise<Plan[]>;
}
