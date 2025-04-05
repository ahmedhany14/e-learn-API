import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { SectionsInstructorRepo } from '../../repository/instructor/sections.instructor.repo';

// dto
import { EditSectionDto } from '../../dtos/edit.section.dto';
import { Section } from 'src/sections/entity/sections.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class SectionsInstructorService {
    constructor(
        @Inject()
        private readonly SectionsRepo: SectionsInstructorRepo,
    ) {}

    async findSectionById(id: number): Promise<Section> {
        return await this.SectionsRepo.findOne({ id });
    }

    async createSection(title: string, order: number, course_id: number) {
        return await this.SectionsRepo.create(
            this.SectionsRepo.newSection(title, order, course_id),
        );
    }

    async updateSection(id: Section['id'], editSectionDto: EditSectionDto) {
        return await this.SectionsRepo.findOneAndUpdate({ id }, editSectionDto);
    }

    async deleteSection(id: Section['id']) {
        await this.SectionsRepo.findOneAndDelete({ id });
    }

    async findCourseSections(course_id: Course['id']) {
        return await this.SectionsRepo.find({
            course: { id: course_id },
        });
    }

    async updateSectionsOrder(
        sections: Section[],
        section_id: Section['id'],
        new_order: number,
    ): Promise<Section[]> {
        return await this.SectionsRepo.updateSectionsOrder(sections, section_id, new_order);
    }
}
