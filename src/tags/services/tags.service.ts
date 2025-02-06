import { Inject, Injectable } from '@nestjs/common';

// dto
import { CreateTagDto } from '../dtos/create.tag.dto';

// services and repository
import { TagsRepository } from '../repository/tags.repo';
import { GetByThree } from '../interfaces/tags.interfases';

@Injectable()
export class TagsService {
  constructor(
    @Inject()
    private readonly tagsRepo: TagsRepository,
  ) {}

  async getOneTageByThree(getByThree: GetByThree) {
    return await this.tagsRepo.getOneTageByThree(getByThree);
  }

  async createNewTage(createTagDto: CreateTagDto, admin_id: number) {
    return await this.tagsRepo.createNewTage(createTagDto, admin_id);
  }
}
