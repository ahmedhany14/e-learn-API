import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { AddVideoDto } from '../../instructor/dtos/add.video.dto';

// orm and entities
import { Repository, FindOptionsSelect } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Videos } from '../entities/videos.entity';
import { VideoEnum, VideoRelations } from '../entities/enums/videos.enums';
import { UpdateVideoDto } from 'src/instructor/dtos/update.video.dto';
@Injectable()
export class VideosRepo {
    private readonly logger = new Logger(VideosRepo.name);

    constructor(
        @InjectRepository(Videos)
        private readonly videosRepository: Repository<Videos>,
    ) { }

    async findOneById(select: VideoEnum[], relations: VideoRelations[] = [], video_id: number): Promise<Videos> {
        try {
            return await this.videosRepository.findOne({
                where: { id: video_id },
                select: select as FindOptionsSelect<Videos>,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while fetching video with id: ${video_id}`,
                details: error.message,
            });
        }
    }

    async deleteVideo(video_id: number): Promise<void> {
        try {
            await this.videosRepository.delete(video_id);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while deleting video with id: ${video_id}`,
                details: error.message,
            });
        }
    }

    async createVideo(
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

    async updateVideo(video_id: number, updateVideoDto: UpdateVideoDto): Promise<Videos> {
        try {   
            let video = await this.videosRepository.findOne({
                where: { id: video_id },
            });

            video = {
                ...video,
                ...updateVideoDto,
            }

            return await this.videosRepository.save(video);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while updating video with id: ${video_id}`,
                details: error.message,
            });
        }
    }
}
