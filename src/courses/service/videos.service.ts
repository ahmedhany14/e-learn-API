import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { VideosRepo } from '../repository/videos.repo';
import { AddVideoDto } from '../../instructor/dtos/add.video.dto';

@Injectable()
export class VideosService {
  constructor(
    @Inject()
    private readonly videosRepo: VideosRepo,
  ) {}

  async addVideoToSection(
    addVideoToSectionDto: AddVideoDto,
    section_id: string,
    order: number,
  ) {
    return await this.videosRepo.addVideoToSection(
      addVideoToSectionDto,
      section_id,
      order,
    );
  }
}
