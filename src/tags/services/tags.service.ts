import { Inject, Injectable } from '@nestjs/common';

// dto
import { CreateTagDto } from '../dtos/create.tag.dto';

// services and repository
import { TagsRepository } from '../repository/tags.repo';
import { GetByThree } from '../interfaces/tags.interfases';
import { Tags } from '../entity/tags.entity';
import { UpdateTagDto } from '../dtos/update.tag.dto';

@Injectable()
export class TagsService {
    constructor(
        @Inject()
        private readonly tagsRepo: TagsRepository,
    ) {}

    async getAllTags() {
        return await this.tagsRepo.getAllTags();
    }

    async getTagById(id: number) {
        return await this.tagsRepo.getTagById(id);
    }

    async deleteTagById(id: number) {
        return await this.tagsRepo.deleteTagById(id);
    }

    async getOneTageByThree(getByThree: GetByThree) {
        return await this.tagsRepo.getOneTageByThree(getByThree);
    }

    async createNewTage(createTagDto: CreateTagDto, admin_id: number) {
        return await this.tagsRepo.createNewTage(createTagDto, admin_id);
    }

    async updateTagById(tag: Tags, updateTagDto: UpdateTagDto) {
        return await this.tagsRepo.updateTagById(tag, updateTagDto);
    }
}
