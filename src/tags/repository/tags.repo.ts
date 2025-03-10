import { Injectable, InternalServerErrorException } from '@nestjs/common';

// orm and entity
import { Tags } from '../entity/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// dto and interfaces
import { CreateTagDto } from '../dtos/create.tag.dto';
import { GetByThree } from '../interfaces/tags.interfases';
import { UpdateTagDto } from '../dtos/update.tag.dto';

@Injectable()
export class TagsRepository {
    constructor(
        @InjectRepository(Tags)
        private readonly tagsRepository: Repository<Tags>,
    ) {}

    async getTagById(id: number) {
        try {
            return await this.tagsRepository.findOne({
                where: { id },
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                message: 'Error while fetching tag',
                details: error.message,
            });
        }
    }

    async createNewTage(createTagDto: CreateTagDto, admin_id: number) {
        try {
            const tag = this.tagsRepository.create({
                ...createTagDto,
                tag_creator: { id: admin_id },
            });

            return await this.tagsRepository.save(tag);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while creating tag',
                details: error.message,
            });
        }
    }

    async deleteTagById(id: number) {
        try {
            await this.tagsRepository.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while deleting tag',
                details: error.message,
            });
        }
    }

    async getOneTageByThree(getByThree: GetByThree) {
        try {
            return await this.tagsRepository.findOne({
                where: { ...getByThree },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while fetching tags',
                details: error.message,
            });
        }
    }

    async getAllTags() {
        try {
            return await this.tagsRepository.find();
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while fetching tags',
            });
        }
    }

    async updateTagById(tag: Tags, updateTagDto: UpdateTagDto) {
        try {
            tag = {
                ...tag,
                ...updateTagDto,
            };
            return await this.tagsRepository.save(tag);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while updating tag',
            });
        }
    }
}
