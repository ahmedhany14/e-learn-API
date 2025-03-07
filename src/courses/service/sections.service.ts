import { Inject, Injectable } from '@nestjs/common';
import { SectionsRepo } from '../repository/sections.repo';
import { EditSectionDto } from '../../instructor/dtos/edit.section.dto';
import { SectionDocument } from '../entities/sections.entity';

@Injectable()
export class SectionsService {
  constructor(
    @Inject()
    private readonly SectionsRepo: SectionsRepo,
  ) { }

  async findSectionById(section_id: number) {
    return await this.SectionsRepo.findSectionById(section_id);
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

}
