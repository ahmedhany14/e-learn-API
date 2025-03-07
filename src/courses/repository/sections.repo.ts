import { Injectable, InternalServerErrorException } from '@nestjs/common';

// entities and orm

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../entities/sections.entity';
import { EditSectionDto } from 'src/instructor/dtos/edit.section.dto';

@Injectable()
export class SectionsRepo {
    constructor(
        @InjectRepository(Section)
        private readonly sectionRepository: Repository<Section>,
    ) { }

    async findSectionById(section_id: number): Promise<Section> {
        try {
            return await this.sectionRepository.findOne({
                where: {
                    id: section_id,
                },
            });

        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while finding section with id ${section_id}`,
                details: error.message,
            });
        }
    }

    async getCourseSections(course_id: number): Promise<Section[]> {
        try {
            // get all section related to the course and sort them based on the order
            return await this.sectionRepository.find({
                where: {
                    course: {
                        id: course_id,
                    }
                },
                order: {
                    order: 'ASC',
                },
            });

        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while getting sections for course with id ${course_id}`,
                details: error.message,
            });
        }
    }

    async createSection(
        title: string,
        order: string,
        course_id: number,
    ): Promise<Section> {
        try {
            const section = await this.sectionRepository.create({
                title: title,
                order: order,
                course: {
                    id: course_id,
                },
            });

            return await this.sectionRepository.save(section);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while creating section with title ${title}`,
                details: error.message,
            });
        }
    }

    async editSection(
        section_id: number,
        editSectionDto: EditSectionDto,
    ): Promise<Section> {
        try {
            let section = await this.findSectionById(section_id);

            section = {
                ...section,
                ...editSectionDto,
            }

            return await this.sectionRepository.save(section);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while editing section with id ${section_id}`,
                details: error.message,
            });
        }
    }

    async deleteSection(section_id: number): Promise<void> {
        try {
            await this.sectionRepository.delete({
                id: section_id,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while deleting section with id ${section_id}`,
                details: error.message,
            });
        }
    }

    async updateOrder(section_id: number, new_order: string): Promise<Section> {
        try {
            let section = await this.findSectionById(section_id);

            section = {
                ...section,
                order: new_order,
            }

            return await this.sectionRepository.save(section);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while updating order for section with id ${section_id}`,
                details: error.message,
            });
        }
    }
}
