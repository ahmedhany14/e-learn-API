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


import {
    generateJitteredKeyBetween,
    generateKeyBetween
} from 'fractional-indexing-jittered';
import { IndexGenerator } from 'fractional-indexing-jittered';

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
import { ReOrderSectionsDto } from '../dtos/re-order.sections.dto';

@Controller('instructor-sections')
export class InstructorManageSectionsController {
    private readonly logger = new Logger(InstructorManageSectionsController.name);
    private readonly indexGenerator = new IndexGenerator([]);

    constructor(
        @Inject()
        private readonly sectionService: SectionsService,
        @Inject()
        private readonly courseService: CourseService,
    ) { }


    private UpDateGenerator(sections) {
        const sectionOrders = sections.map((section) => section.order);
        this.indexGenerator.updateList(sectionOrders);
    }
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

        this.UpDateGenerator(sections);

        let newOrder: string;

        if (sections.length === 0) {
            newOrder = this.indexGenerator.keyStart();
        } else {
            console.log('sections', sections[sections.length - 1].order);
            newOrder = this.indexGenerator.keyEnd();
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

    @UseGuards(IsYourSectionGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('move-section/:course_id/:section_id')
    async moveSection(
        @Param('section_id', ParseIntPipe) section_id: number,
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() reOrderSectionsDto: ReOrderSectionsDto,
    ) {

        const all_sections = await this.sectionService.getCourseSections(course_id);

        if (reOrderSectionsDto.new_order < 1 || reOrderSectionsDto.new_order > all_sections.length) {
            throw new ConflictException({
                message: 'Invalid new order',
                details: 'New order is out of range',
            });
        }

        if (reOrderSectionsDto.new_order !== all_sections.findIndex(section => section.id === section_id) + 1) {
            this.logger.log(`moving section with id: ${section_id} to new order: ${reOrderSectionsDto.new_order}`);
            let newOrder: string;
            this.UpDateGenerator(all_sections);
            if (reOrderSectionsDto.new_order === 1) {
                newOrder = generateKeyBetween(
                    'a0',
                    all_sections[reOrderSectionsDto.new_order - 1].order,
                )

            } else if (reOrderSectionsDto.new_order === all_sections.length) {
                newOrder = generateKeyBetween(
                    all_sections[reOrderSectionsDto.new_order - 1].order,
                    null
                );
            } else {
                newOrder = generateJitteredKeyBetween(
                    all_sections[reOrderSectionsDto.new_order - 1].order,
                    all_sections[reOrderSectionsDto.new_order].order
                );
            }

            console.log('newOrder', newOrder);

            await this.sectionService.updateOrder(section_id, newOrder);
        }


        return {
            response: {
                message: 'Section moved successfully',
            },
        };
    }

}
