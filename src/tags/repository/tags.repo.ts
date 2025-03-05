import { Injectable, InternalServerErrorException } from '@nestjs/common';

// orm and entity
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from '../entity/tags.entity';

// dto and interfaces
import { CreateTagDto } from '../dtos/create.tag.dto';
import { GetByThree } from '../interfaces/tags.interfases';

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
        relations: ['tag_creator'],
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while fetching tag',
      });
    }
  }

  async deleteTagById(id: number) {
    try {
      return await this.tagsRepository.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while deleting tag',
      });
    }
  }

  async getOneTageByThree(getByThree: GetByThree) {
    try {
      return await this.tagsRepository.findOne({
        where: getByThree,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while fetching tags',
      });
    }
  }

  async createNewTage(createTagDto: CreateTagDto, admin_id: number) {
    try {
      const tag = this.tagsRepository.create({
        ...createTagDto,
        tag_creator: { id: admin_id },
      });

      await this.tagsRepository.save(tag);
      return tag;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while creating tag',
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

  async save(tag: Tags) {
    try {
      return await this.tagsRepository.save(tag);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while updating tag',
      });
    }
  }
}
