import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

// services and providers
import { ReviewCoursesService } from '../services/review-courses.service';
import { CourseService } from '../../../courses/service/course.service';
import { CourseEnum, CourseRelations } from '../../../courses/entities/course.enums';
import { CourseStatusEnum } from '../../../courses/enums/course.status.enum';
import { CourseReviewEnum } from '../enums/course.review.enum';

@Injectable()
export class IsReadyForReviewGuard implements CanActivate {
    constructor(
        @Inject()
        private readonly reviewCoursesService: ReviewCoursesService,
        @Inject()
        private readonly courseService: CourseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const courseId = context.switchToHttp().getRequest().params.course_id;
        const course = await this.courseService.getCourse(
            [CourseEnum.ID, CourseEnum.STATE],
            [CourseRelations.INSTRUCTOR],
            courseId,
        );

        if (!course) {
            throw new NotFoundException({
                message: 'Course not found',
            });
        }

        if (course.state !== CourseStatusEnum.IN_REVIEW) {
            throw new NotFoundException({
                message: 'Course is not ready for review',
            });
        }

        const courseReview = await this.reviewCoursesService.getCourseReview(courseId, {
            state: CourseReviewEnum.PENDING,
        });

        if (!courseReview) {
            throw new NotFoundException({
                message: 'Course review not found',
            });
        }

        if (courseReview.state !== CourseReviewEnum.PENDING) {
            throw new NotFoundException({
                message: 'Course review is not pending, cannot be reviewed',
            });
        }
        return true;
    }
}
