import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { SectionsInstructorRepo } from '../../repository/instructor/sections.instructor.repo';

// dto
import { EditSectionDto } from '../../dtos/edit.section.dto';
import { Section } from 'src/sections/entity/sections.entity';
import { Course } from 'src/courses/entities/course.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class SectionsInstructorService {
    constructor(
        @Inject()
        private readonly SectionsRepo: SectionsInstructorRepo,
    ) {}

    async create(title: string, order: number, course_id: number) {
        return await this.SectionsRepo.create(
            this.SectionsRepo.newSection(title, order, course_id),
        );
    }
    async find(filter: FindOptionsWhere<Section>): Promise<Section[]> {
        return await this.SectionsRepo.find(filter);
    }

    async findOne(filter: FindOptionsWhere<Section>): Promise<Section> {
        return await this.SectionsRepo.findOne(filter);
    }

    async findOneAndUpdate(
        filter: FindOptionsWhere<Section>,
        editSectionDto: EditSectionDto,
    ): Promise<Section> {
        return await this.SectionsRepo.findOneAndUpdate(filter, editSectionDto);
    }

    async findOneAndDelete(filter: FindOptionsWhere<Section>): Promise<void> {
        await this.SectionsRepo.findOneAndDelete(filter);
    }

    async updateSectionsOrder(
        sections: Section[],
        section_id: Section['id'],
        new_order: number,
    ): Promise<Section[]> {
        return await this.SectionsRepo.updateSectionsOrder(sections, section_id, new_order);
    }
}
