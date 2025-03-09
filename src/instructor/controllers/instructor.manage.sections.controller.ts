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

// services
import { FactoryKeyGeneratorProvider } from '../../courses/providers/factory.key.generator.provider';
import { SectionsInstructorService } from 'src/sections/services/instructor/sections.instructor.service';
import { CourseService } from 'src/courses/service/course.service';

// dtos
import { AddCourseSectionsDto } from '../dtos/sections/add.course.sections.dto';
import { EditSectionDto } from '../dtos/sections/edit.section.dto';
import { ReOrderingDto } from '../dtos/re-ordering/re-ordering.dto';

// guards
import { IsYourCourseGuard } from '../guards/is.your.course.guard';
import { IsYourSectionGuard } from '../guards/is.your.section.guard';

// Auth and Role
import { ROLE } from 'src/auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

// entities and enums
import { Section } from 'src/sections/entity/sections.entity';
import {
    SectionEnum,
    SectionRelations,
} from 'src/sections/entity/sections.enums';

@Controller('instructor-sections')
export class InstructorManageSectionsController {
    private readonly logger = new Logger(InstructorManageSectionsController.name);

    constructor(
        @Inject()
        private readonly courseService: CourseService,
        @Inject()
        private readonly sectionService: SectionsInstructorService,
        @Inject()
        private readonly factoryKeyGeneratorProvider: FactoryKeyGeneratorProvider<Section>,
    ) { }

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

        const course = await this.courseService.getCourse([], [], course_id);
        const sections = await course.sections;

        const order: string = await this.factoryKeyGeneratorProvider.generateNewKey(
            'new_key',
            sections,
        );
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
    async deleteSection(@Param('section_id', ParseIntPipe) section_id: number) {
        this.logger.log(`deleting section with id: ${section_id}`);

        const select: SectionEnum[] = [SectionEnum.ID];
        const relations: SectionRelations[] = [];

        const section = await this.sectionService.findSectionById(
            select,
            relations,
            section_id,
        );

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
        const all_sections = await this.sectionService.getCourseSections(course_id);

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

            let order: string,
                target_order: number = reOrderSectionsDto.new_order;
            const position =
                target_order === 1
                    ? 'first_key'
                    : target_order === all_sections.length
                        ? 'last_key'
                        : 'between_key';

            if (position === 'first_key')
                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'first_key',
                    all_sections,
                    all_sections[target_order - 1].order,
                );
            else if (position === 'last_key')
                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'last_key',
                    all_sections,
                    all_sections[target_order - 1].order,
                );
            else {
                let my_order = -1;

                for (let i = 0; i < all_sections.length; i++)
                    if (all_sections[i].id === section_id) my_order = i + 1;

                let prev: string, next: string;
                if (target_order > my_order) {
                    next = all_sections[target_order].order;
                    prev = all_sections[target_order - 1].order;
                } else {
                    next = all_sections[target_order - 1].order;
                    prev = all_sections[target_order - 2].order;
                }

                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'between_key',
                    all_sections,
                    prev,
                    next,
                );
            }

            await this.sectionService.updateOrder(section_id, order);
        }

        return {
            response: {
                message: 'Section moved successfully',
            },
        };
    }
}
