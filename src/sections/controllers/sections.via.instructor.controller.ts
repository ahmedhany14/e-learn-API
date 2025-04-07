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

import { SectionsInstructorService } from 'src/sections/services/instructor/sections.instructor.service';

// dtos
import { AddCourseSectionsDto } from '../dtos/add.course.sections.dto';
import { EditSectionDto } from '../dtos/edit.section.dto';
import { ReOrderingDto } from '../../common/dtos/re-ordering/re-ordering.dto';

// guards
import { IsYourCourseGuard } from '../../courses/guards/is.your.course.guard';
import { IsYourSectionGuard } from '../guards/is.your.section.guard';

// Auth and Role
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

@Controller('sections-via-instructor')
export class SectionsViaInstructorController {
    private readonly logger = new Logger(SectionsViaInstructorController.name);

    constructor(
        @Inject()
        private readonly sectionService: SectionsInstructorService,
    ) {}

    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('add-section/:course_id')
    async addSections(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() addCourseSectionsDto: AddCourseSectionsDto,
    ) {
        this.logger.log(
            `adding sections to course with id: ${course_id}, with properties: ${JSON.stringify(addCourseSectionsDto)}`,
        );

        const sections = await this.sectionService.findCourseSections(course_id);

        const order = sections.length + 1;
        console.log('newOrder', order);

        const section = await this.sectionService.createSection(
            addCourseSectionsDto.title,
            order,
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
        this.logger.log(
            `editing section with id: ${section_id}, with properties: ${JSON.stringify(editSectionDto)}`,
        );

        const section = await this.sectionService.updateSection(section_id, editSectionDto);

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
    async deleteSection(@Param('section_id', ParseIntPipe) section_id: number) {
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

    @UseGuards(IsYourSectionGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('move-section/:course_id/:section_id')
    async moveSection(
        @Param('section_id', ParseIntPipe) section_id: number,
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() reOrderSectionsDto: ReOrderingDto,
    ) {
        let all_sections = await this.sectionService.findCourseSections(course_id);

        if (
            reOrderSectionsDto.new_order < 1 ||
            reOrderSectionsDto.new_order > all_sections.length
        ) {
            throw new ConflictException({
                message: 'Invalid new order',
                details: 'New order is out of range',
            });
        }

        if (
            reOrderSectionsDto.new_order !==
            all_sections.findIndex((section) => section.id === section_id) + 1
        ) {
            this.logger.log(
                `moving section with id: ${section_id} to new order: ${reOrderSectionsDto.new_order}`,
            );

            all_sections = await this.sectionService.updateSectionsOrder(
                all_sections,
                section_id,
                reOrderSectionsDto.new_order,
            );
        }

        return {
            response: {
                message: 'Section moved successfully',
                all_sections,
            },
        };
    }
}
