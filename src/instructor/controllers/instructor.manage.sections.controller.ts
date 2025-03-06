import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SectionsService } from 'src/courses/service/sections.service';
import { IsYourCourseGuard } from '../guards/is.your.course.guard';
import { ROLE } from 'src/auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';
import { AddCourseSectionsDto } from '../dtos/add.course.sections.dto';
import { CourseService } from 'src/courses/service/course.service';
import { EditSectionDto } from '../dtos/edit.section.dto';
import { IsYourSectionGuard } from '../guards/is.your.section.guard';

@Controller('instructor-sections')
export class InstructorManageSectionsController {
  constructor(
    @Inject()
    private readonly sectionService: SectionsService,
    @Inject()
    private readonly courseService: CourseService,
  ) {}

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

    const section = await this.sectionService.createSection(
      addCourseSectionsDto.title,
      newOrder,
      course_id,
    );

    const course_with_section = await this.courseService.addSectionsToCourse(
      course_id,
      section,
    );
    return {
      response: {
        message: 'Sections added successfully',
        section,
        course_with_section,
      },
    };
  }

  @UseGuards(IsYourSectionGuard)
  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Patch('edit-section/:section_id')
  async editSection(
    @Param('section_id', ObjectIdValidationPipe) section_id: string,
    @Body() editSectionDto: EditSectionDto,
  ) {
    const section = await this.sectionService.editSection(
      section_id,
      editSectionDto,
    );

    return {
      response: {
        message: 'Section updated successfully',
        section,
      },
    };
  }

  @Delete('delete-section/:section_id')
  async deleteSection(
    @Param('section_id', ObjectIdValidationPipe) section_id: string,
  ) {}

  @Patch('reorder-sections/:course_id')
  async reorderSections(
    @Param('course_id', ObjectIdValidationPipe) course_id: string,
    //@Body() reorderSectionsDto: ReorderSectionsDto,
  ) {}
}
