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

  async getCourseSections(course_id: string): Promise<SectionDocument[]> {
    try {
      return await this.sectionsModel
        .find(
          { course_id },
          {
            order: 1,
          },
        )
        .sort({ order: 1 });
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error while getting sections for course with id ${course_id}`,
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

  async deleteSection(section_id: string) {
    try {
      await this.sectionsModel.findByIdAndDelete(section_id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error while deleting section with id ${section_id}`,
        details: error.message,
      });
    }
  }

  async reorderAfterDeleteSections(sections: SectionDocument[]) {
    try {
      for (let i = 0; i < sections.length; i++) {
        sections[i].order = i + 1;
        await sections[i].save();
      }
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while reordering sections',
        details: error.message,
      });
    }
  }
}
