import { Inject, Injectable } from '@nestjs/common';
import { SectionsRepo } from '../repository/sections.repo';
import { EditSectionDto } from '../../instructor/dtos/edit.section.dto';
import { SectionDocument } from '../entities/sections.entity';

@Injectable()
export class SectionsService {
  constructor(
    @Inject()
    private readonly SectionsRepo: SectionsRepo,
  ) {}

  async findSectionById(section_id: string) {
    return await this.SectionsRepo.findSectionById(section_id);
  }

  async createSection(title: string, order: number, course_id: string) {
    return await this.SectionsRepo.createSection(title, order, course_id);
  }

  async editSection(section_id: string, editSectionDto: EditSectionDto) {
    return await this.SectionsRepo.editSection(section_id, editSectionDto);
  }

  async deleteSection(section_id: string) {
    await this.SectionsRepo.deleteSection(section_id);
  }

  async getCourseSections(course_id: string) {
    return await this.SectionsRepo.getCourseSections(course_id);
  }

  async reorderAfterDeleteSections(course_id: string) {
    const sections: SectionDocument[] = await this.getCourseSections(course_id);

    await this.SectionsRepo.reorderAfterDeleteSections(sections);
  }
}
