import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { SectionsInstructorRepo } from '../../repository/instructor/sections.instructor.repo';

// dto
import { EditSectionDto } from '../../dtos/edit.section.dto';
import { SectionEnum, SectionRelations } from '../../entity/sections.enums';
import { Section } from 'src/sections/entity/sections.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class SectionsInstructorService {
    constructor(
        @Inject()
        private readonly SectionsRepo: SectionsInstructorRepo,
    ) { }

    async findSectionById(
        select: SectionEnum[] = [],
        relations: SectionRelations[] = [],
        section_id: number,
    ) {
        return await this.SectionsRepo.findSectionById(
            select,
            relations,
            section_id,
        );
    }

    async createSection(title: string, order: number, course_id: number) {
        return await this.SectionsRepo.createSection(title, order, course_id);
    }

    async editSection(section_id: Section['id'], editSectionDto: EditSectionDto) {
        return await this.SectionsRepo.editSection(section_id, editSectionDto);
    }

    async deleteSection(section_id: Section['id']) {
        await this.SectionsRepo.deleteSection(section_id);
    }

    async getCourseSections(course_id: Course['id']) {
        return await this.SectionsRepo.getCourseSections(course_id);
    }


    async updateSectionsOrder(sections: Section[], section_id: Section['id'], new_order: number): Promise<Section[]> {
        return await this.SectionsRepo.updateSectionsOrder(sections, section_id, new_order);
    }

}
