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
}
