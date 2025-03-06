import { Inject, Injectable } from '@nestjs/common';
import { SectionsRepo } from '../repository/sections.repo';

@Injectable()
export class SectionsService {
    constructor(
        @Inject()
        private readonly SectionsRepo: SectionsRepo
    ) { }


    async createSection(title: string, order: number, course_id: string) {
        return await this.SectionsRepo.createSection(title, order, course_id);
    }

}
