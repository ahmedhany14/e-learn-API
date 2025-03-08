import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { SectionsRepo } from '../repository/sections.repo';

// dto
import { EditSectionDto } from '../../instructor/dtos/edit.section.dto';
import { SectionEnum, SectionRelations } from '../entities/enums/sections.enums';

@Injectable()
export class SectionsService {
    constructor(
        @Inject()
        private readonly SectionsRepo: SectionsRepo,
    ) { }

    async findSectionById(
        select: SectionEnum[] = [],
        relations: SectionRelations[] = [],
        section_id: number) {
        return await this.SectionsRepo.findSectionById(
            select,
            relations,
            section_id
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
