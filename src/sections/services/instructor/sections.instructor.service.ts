import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { SectionsInstructorRepo } from '../../repository/instructor/sections.instructor.repo';

// dto
import { EditSectionDto } from '../../../instructor/dtos/sections/edit.section.dto';
import { SectionEnum, SectionRelations } from '../../entity/sections.enums';

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

    async createSection(title: string, order: string, course_id: number) {
        return await this.SectionsRepo.createSection(title, order, course_id);
    }

    async editSection(section_id: number, editSectionDto: EditSectionDto) {
        return await this.SectionsRepo.editSection(section_id, editSectionDto);
    }

    async deleteSection(section_id: number) {
        await this.SectionsRepo.deleteSection(section_id);
    }

    async getCourseSections(course_id: number) {
        return await this.SectionsRepo.getCourseSections(course_id);
    }

    async updateOrder(section_id: number, new_order: string) {
        return await this.SectionsRepo.updateOrder(section_id, new_order);
    }
}
