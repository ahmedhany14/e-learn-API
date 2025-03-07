import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { AddVideoDto } from '../../instructor/dtos/add.video.dto';

// orm and entities
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Videos } from '../entities copy/videos.entity';
@Injectable()
export class VideosRepo {
  private readonly logger = new Logger(VideosRepo.name);

  constructor(
    @InjectRepository(Videos)
    private readonly videosRepository: Repository<Videos>,
  ) { }

  async addVideoToSection(
    video: AddVideoDto,
    section_id: number,
    order: string,
  ): Promise<Videos> {
    try {
      const newVideo = this.videosRepository.create({
        ...video,
        section: { id: section_id },
        order,
      });
      return await this.videosRepository.save(newVideo);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while adding video to section',
        details: error.message,
      });
    }
  }
}
