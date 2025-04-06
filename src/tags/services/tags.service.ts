import { Inject, Injectable } from '@nestjs/common';

// dto
import { CreateTagDto } from '../dtos/create.tag.dto';

// services and repository
import { TagsRepository } from '../repository/tags.repo';
import { GetByThree } from '../interfaces/tags.interfases';
import { Tags } from '../entity/tags.entity';
import { UpdateTagDto } from '../dtos/update.tag.dto';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(
        @Inject()
        private readonly tagsRepo: TagsRepository,
    ) {}

    async createTag(createTagDto: CreateTagDto, admin_id: number) {
        return await this.tagsRepo.create(this.tagsRepo.newTag(createTagDto, admin_id));
    }

    async findOneTag(id: number) {
        return await this.tagsRepo.findOne({ id });
    }

    async findAllTags(filter: FindOptionsWhere<Tags>) {
        return await this.tagsRepo.find(filter);
    }

    async findOneTagWithAllFields(getByThree: GetByThree) {
        return this.tagsRepo.findOne({ ...getByThree });
    }

    async deleteTag(id: number) {
        return await this.tagsRepo.findOneAndDelete({ id });
    }

    async updateTag(id: number, updateTagDto: UpdateTagDto) {
        return await this.tagsRepo.findOneAndUpdate({ id }, { ...updateTagDto });
    }
}
