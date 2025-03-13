import { Injectable, InternalServerErrorException } from '@nestjs/common';

// entities and orm
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { Section } from '../../entity/sections.entity';
import { EditSectionDto } from 'src/sections/dtos/edit.section.dto';
import { SectionEnum, SectionRelations } from '../../entity/sections.enums';

@Injectable()
export class SectionsInstructorRepo {
    constructor(
        @InjectRepository(Section)
        private readonly sectionRepository: Repository<Section>,
    ) { }

    async findSectionById(
        select: SectionEnum[] = [],
        relations: SectionRelations[] = [],
        id: number,
    ): Promise<Section> {
        try {
            return await this.sectionRepository.findOne({
                where: {
                    id: id,
                },
                select: select as FindOptionsSelect<Section>,
                relations: relations,
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                message: `Error while finding section with id ${id}`,
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
                    },
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
        order: number,
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
        section_id: Section['id'],
        editSectionDto: EditSectionDto,
    ): Promise<Section> {
        try {
            let section = await this.findSectionById(
                [SectionEnum.ID, SectionEnum.TITLE],
                [],
                section_id,
            );
            section = {
                ...section,
                ...editSectionDto,
            };

            return await this.sectionRepository.save(section);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while editing section with id ${section_id}`,
                details: error.message,
            });
        }
    }

    async deleteSection(section_id: Section['id']): Promise<void> {
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

    async updateSectionsOrder(sections: Section[], section_id: Section['id'], new_order: number): Promise<Section[]> {
        try {
            const section = sections.find((section) => section.id === section_id);

            // remove section from list 
            sections = sections.filter((section) => section.id !== section_id);

            // add section to the new order
            sections.splice(new_order - 1, 0, section);

            // update the order of each section
            sections = sections.map((section, index) => {
                section.order = index + 1;
                return section;
            });

            return await this.sectionRepository.save(sections)
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while updating sections order for section with id ${section_id}`,
                details: error.message,
            });
        }
    }

    async setTemporaryOrders(course_id: number): Promise<void> {
        try{
            const sections = await this.getCourseSections(course_id);

            // flip them to negative
            sections.forEach((section) => {
                section.order = section.order * -1;
            });
            await this.sectionRepository.save(sections);
        }catch(error){
            throw new InternalServerErrorException({
                message: `Error while updating sections order`,
                details: error.message,
            });
        }
    }
}
