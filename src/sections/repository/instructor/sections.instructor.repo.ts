import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// entities and orm
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Section } from '../../entity/sections.entity';
import { AbstractRepoService } from '@app/abstract.db';

@Injectable()
export class SectionsInstructorRepo extends AbstractRepoService<Section> {
    protected logger: Logger = new Logger('SectionsInstructorRepo');

    constructor(
        @InjectRepository(Section)
        private readonly sectionRepository: Repository<Section>,
        entityManager: EntityManager,
    ) {
        super(sectionRepository, entityManager);
    }

    newSection(title: string, order: number, course_id: number) {
        try {
            return this.sectionRepository.create({
                title: title,
                order: order,
                course: {
                    id: course_id,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while creating section with title ${title}`,
                details: error.message,
            });
        }
    }

    async updateSectionsOrder(
        sections: Section[],
        section_id: Section['id'],
        new_order: number,
    ): Promise<Section[]> {
        try {
            const section = sections.find((section) => section.id === section_id);

            // remove a section from the list
            sections = sections.filter((section) => section.id !== section_id);

            // add a section to the new order
            sections.splice(new_order - 1, 0, section);

            // update the order of each section
            sections = sections.map((section, index) => {
                section.order = index + 1;
                return section;
            });

            return await this.sectionRepository.save(sections);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while updating sections order for section with id ${section_id}`,
                details: error.message,
            });
        }
    }
}
