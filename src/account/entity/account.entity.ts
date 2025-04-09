import { Check, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

// Enums
import { RoleEnum } from '../../auth/enums/role.enum';

// Entity
import { Profile } from '../../profile/entity/profile.entity';
import { Instructor } from '../../instructor/entity/instructor.entity';
import { Plan } from '../../plans/entity/plan.entity';
import { AccountSubscriptions } from '../../payments/modules/subscriptions/entity/account.plan.entity';
import { Course } from '../../courses/entities/course.entity';
import { Tags } from '../../tags/entity/tags.entity';
import { CourseReview } from '../../administration/review-courses/entity/course.reviwe.entity';
import { PaymentsHistory } from '../../payments/entities/payments.history.entity';
import { EnrolledCourses } from 'src/payments/modules/enroll-courses/entity/enrolled.courses.entity';
import { AbstractEntity } from '@app/abstract.db/abstract.entity';
import { ChatRoom } from '../../chat/subscribe/entities/char.room.entity';
import { RoomSubscribers } from '../../chat/subscribe/entities/room.subscribers.entity';

@Entity({
    name: 'accounts',
    orderBy: {
        created_at: 'ASC',
    },
    comment: 'User accounts',
})
@Check(`"email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`)
export class Account extends AbstractEntity<Account> {
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
        // select: false,
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
        type: 'varchar',
        nullable: true,
        default: () => 'false',
    })
    payment_account_details: string;

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
        lazy: false,
    })
    profile: Profile;

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

    // each account can have multiple plans, but if the account activates a plan, he can't activate it again until it expires
    @OneToMany(() => AccountSubscriptions, (accountSubscriptions) => accountSubscriptions.account, {
        lazy: true,
    })
    plans_account: Promise<AccountSubscriptions[]>;

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

    // each account can review multiple courses
    @OneToMany(() => CourseReview, (course_review) => course_review.reviewer, {
        lazy: true,
    })
    course_reviews: Promise<CourseReview[]>;

    // each account can have multiple
    @OneToMany(() => PaymentsHistory, (payments_history) => payments_history.account, {
        lazy: true,
    })
    payments_history: Promise<PaymentsHistory[]>;

    // each account can enroll in multiple
    @OneToMany(() => EnrolledCourses, (enrolledCourses) => enrolledCourses.course, {
        lazy: true,
    })
    enrolled_courses: Promise<EnrolledCourses[]>;

    // each instructor account can have one chat rooms
    @OneToOne(() => ChatRoom, (chatRoom) => chatRoom.instructor, {
        lazy: true,
        nullable: true,
    })
    instructor_room: Promise<ChatRoom>;

    @OneToMany(() => RoomSubscribers, (roomSubscribers) => roomSubscribers.subscriber, {
        lazy: true,
    })
    room_subscriptions: Promise<RoomSubscribers[]>;
}
