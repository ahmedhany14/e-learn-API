import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Videos, VideosDocument } from '../entities/videos.entity';
import { AddVideoDto } from '../../instructor/dtos/add.video.dto';

@Injectable()
export class VideosRepo {
  private readonly logger = new Logger(VideosRepo.name);

  constructor(
    @InjectModel(Videos.name)
    private readonly coursesModel: Model<VideosDocument>,
  ) {}

  async addVideoToSection(
    video: AddVideoDto,
    section_id: string,
    order: number,
  ): Promise<VideosDocument> {
    try {
      const newVideo = new this.coursesModel({
        ...video,
        section: section_id,
        order,
      });

      return await newVideo.save();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while adding video to section',
        details: error.message,
      });
    }
  }
}
