import {
    Controller,
    Inject,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// services and providers
import { FileService } from './file.service';
import { CourseService } from '../courses/service/course.service';

// decorators for auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

// decorators
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { ProfileService } from '../profile/services/profile.service';
import { CourseEnum, CourseRelations } from 'src/courses/entities/course.enums';
import { IsYourCourseGuard } from 'src/courses/guards/is.your.course.guard';
import { ExtractCourseDate } from 'src/common/decorators/request.extractCourseDate.decorator';
import { Course } from 'src/courses/entities/course.entity';

@Controller('file')
export class FileController {
    constructor(
        @Inject()
        private readonly fileService: FileService,
        @Inject()
        private readonly courseService: CourseService,
        @Inject()
        private readonly profileService: ProfileService,
    ) { }

    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Post('upload-course-image/:course_id')
    @UseInterceptors(FileInterceptor('course-image'))
    async uploadCourseImage(
        @UploadedFile() file: Express.Multer.File,
        @Param('course_id', ParseIntPipe) course_id: number,
        @ExtractCourseDate() course: Course,
    ) {
        const path = `courses/${course.title.trim().replace(/\s/g, '-')}/course_image`;
        const fileKey = course.image_url.split('/').pop();
        if (fileKey !== 'default.jpg') {
            await this.fileService.deleteImage(`${path}/${fileKey}`);
        }
        const filename = await this.fileService.uploadImage(
            file,
            path,
        )

        await this.courseService.updateImageName(course_id, filename);

        return {
            response: {
                message: 'Course image uploaded successfully',
                fileName: filename,
            },
        };
    }

    @AUTH(AuthEnum.BEARER)
    @Post('upload-profile-image')
    @UseInterceptors(FileInterceptor('profile-image'))
    async uploadProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @ExtractAccountData('id') account_id: number,
    ) {
        const profile = await this.profileService.findByAccountId(account_id);
        if (profile.profile_image) await this.fileService.deleteImage(`profile/${profile.profile_image}`);
        const filename = await this.fileService.uploadImage(
            file,
            'profile',
        );

        await this.profileService.updateProfileImage(account_id, filename);
        return {
            response: {
                message: 'Profile image uploaded successfully',
                fileName: filename,
            },
        };
    }
}
