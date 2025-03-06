import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section, SectionDocument } from '../entities/sections.entity';
import { EditSectionDto } from '../../instructor/dtos/edit.section.dto';

@Injectable()
export class SectionsRepo {
  constructor(
    @InjectModel(Section.name)
    private readonly sectionsModel: Model<SectionDocument>,
  ) {}

  async findSectionById(section_id: string): Promise<SectionDocument> {
    try {
      return await this.sectionsModel.findById(section_id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error while finding section with id ${section_id}`,
        details: error.message,
      });
    }
  }

  async createSection(
    title: string,
    order: number,
    course_id: string,
  ): Promise<SectionDocument> {
    try {
      const section = new this.sectionsModel({
        title,
        order,
        course_id,
      });

      return await section.save();
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error while creating section with title ${title}`,
        details: error.message,
      });
    }
  }

  async editSection(
    section_id: string,
    editSectionDto: EditSectionDto,
  ): Promise<SectionDocument> {
    try {
      return await this.sectionsModel.findByIdAndUpdate(
        section_id,
        editSectionDto,
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error while editing section with id ${section_id}`,
        details: error.message,
      });
    }
  }
}
