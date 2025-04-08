import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';

// services and providers
import { ReviewCoursesService } from '../services/review-courses.service';
import { CourseService } from '../../../courses/service/course.service';
import { CourseStatusEnum } from '../../../courses/enums/course.status.enum';
import { CourseReviewEnum } from '../enums/course.review.enum';

@Injectable()
export class IsReadyForReviewGuard implements CanActivate {
    private readonly logger = new Logger(IsReadyForReviewGuard.name);

    constructor(
        @Inject()
        private readonly reviewCoursesService: ReviewCoursesService,
        @Inject()
        private readonly courseService: CourseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const id = context.switchToHttp().getRequest().params.review_course_id;

        const courseReview = await this.reviewCoursesService.findOne({
            id,
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

        const course = await this.courseService.findOne({ id: courseReview.course.id });

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

        this.logger.log(`passed guard`);

        return true;
    }
}
