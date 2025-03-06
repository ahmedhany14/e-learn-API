import { Inject, Injectable } from '@nestjs/common';
import { SectionsRepo } from '../repository/sections.repo';
import { EditSectionDto } from '../../instructor/dtos/edit.section.dto';

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
}
