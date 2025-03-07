import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';

import { generateKeyBetween } from "fractional-indexing";

// services
import { SectionsService } from 'src/courses/service/sections.service';
import { CourseService } from 'src/courses/service/course.service';

// dtos
import { AddCourseSectionsDto } from '../dtos/add.course.sections.dto';
import { EditSectionDto } from '../dtos/edit.section.dto';

// guards
import { IsYourCourseGuard } from '../guards/is.your.course.guard';
import { IsYourSectionGuard } from '../guards/is.your.section.guard';

// Auth and Role
import { ROLE } from 'src/auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

@Controller('instructor-sections')
export class InstructorManageSectionsController {
    private readonly logger = new Logger(InstructorManageSectionsController.name);

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
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() addCourseSectionsDto: AddCourseSectionsDto,
    ) {
        this.logger.log(`adding sections to course with id: ${course_id}, with properties: ${JSON.stringify(addCourseSectionsDto)}`);

        const course = await this.courseService.getCourse(course_id);
        const sections = await course.sections;

        let newOrder: string;

        if (sections.length === 0) {
            newOrder = 'a'
        } else {
            const lastOrder = sections[sections.length - 1].order;
            newOrder = generateKeyBetween(lastOrder, null);
        }

        console.log('newOrder', newOrder);

        const section = await this.sectionService.createSection(
            addCourseSectionsDto.title,
            newOrder,
            course_id,
        );

        return {
            response: {
                message: 'Sections added successfully',
                section,
            },
        };
    }

    @UseGuards(IsYourSectionGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('edit-section/:section_id')
    async editSection(
        @Param('section_id', ParseIntPipe) section_id: number,
        @Body() editSectionDto: EditSectionDto,
    ) {
        this.logger.log(`editing section with id: ${section_id}, with properties: ${JSON.stringify(editSectionDto)}`);

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

    @UseGuards(IsYourSectionGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Delete('delete-section/:section_id')
    async deleteSection(
        @Param('section_id', ParseIntPipe) section_id: number,
    ) {
        this.logger.log(`deleting section with id: ${section_id}`);

        const section = await this.sectionService.findSectionById(section_id);

        const videos = await section.videos;

        if (videos.length > 0) {
            throw new ConflictException({
                message: 'Section has videos',
                details: 'Move videos to another sections or delete them',
            });
        }

        await this.sectionService.deleteSection(section_id);


        return {
            response: {
                message: 'Section deleted successfully',
            },
        };
    }
}
