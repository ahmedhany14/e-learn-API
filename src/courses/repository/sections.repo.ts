import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section, SectionDocument } from '../entities/sections.entity';

@Injectable()
export class SectionsRepo {

    constructor(
        @InjectModel(Section.name)
        private readonly sectionsModel: Model<SectionDocument>,
    ) { }


    async createSection(title: string, course_id: string) {
        try {
            const section = new this.sectionsModel({
                title,
                course_id,
            });

            return await section.save();
        } catch (error) {
            console.log(error);
            throw new Error('Error while creating section');
        }
    }

}
