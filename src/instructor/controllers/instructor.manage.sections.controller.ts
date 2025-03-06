import { Body, Controller, Inject, Param, Patch, UseGuards } from '@nestjs/common';
import { SectionsService } from 'src/courses/service/sections.service';
import { IsYourCourseGuard } from '../guards/is.your.course.guard';
import { ROLE } from 'src/auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';
import { AddCourseSectionsDto } from '../dtos/add.course.sections.dto';
import { CourseService } from 'src/courses/service/course.service';

@Controller('instructor-sections')
export class InstructorManageSectionsController {
    constructor(
        @Inject()
        private readonly sectionService: SectionsService,

        @Inject()
        private readonly courseService: CourseService,
    ) { }


    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('add-section/:course_id')
    async addSections(
        @Param('course_id', ObjectIdValidationPipe) course_id: string,
        @Body() addCourseSectionsDto: AddCourseSectionsDto,
    ) {
        const course = await this.courseService.getCourse(course_id);
        const newOrder = course.course_sections.length + 1;

        const section = await this.sectionService.createSection(addCourseSectionsDto.title, newOrder, course_id);

        const course_with_section = await this.courseService.addSectionsToCourse(course_id, section);
        return {
            response: {
                message: 'Sections added successfully',
                section,
                course_with_section
            },
        };
    }


}
