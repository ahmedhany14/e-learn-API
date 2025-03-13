import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { AddVideoDto } from '../../dtos/add.video.dto';

// orm and entities
import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Videos } from '../../entity/videos.entity';
import { VideoEnum, VideoRelations } from '../../entity/videos.enums';
import { UpdateVideoDto } from '../../dtos/update.video.dto';

@Injectable()
export class VideosInstructorRepo {
    private readonly logger = new Logger(VideosInstructorRepo.name);

    constructor(
        @InjectRepository(Videos)
        private readonly videosRepository: Repository<Videos>,
    ) { }

    async findOneById(
        select: VideoEnum[],
        relations: VideoRelations[] = [],
        video_id: number,
    ): Promise<Videos> {
        try {
            return await this.videosRepository.findOne({
                where: { id: video_id },
                select: select as FindOptionsSelect<Videos>,
                relations: relations as string[],
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while fetching video with id: ${video_id}`,
                details: error.message,
            });
        }
    }

    async findAllVideosInSection(select: VideoEnum[], section_id: number): Promise<Videos[]> {
        try {
            return await this.videosRepository.find({
                where: { section: { id: section_id } },
                select: select as FindOptionsSelect<Videos>,
                order: {
                    order: 'ASC',
                },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while fetching videos in section with id: ${section_id}`,
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

    async createVideo(video: AddVideoDto, section_id: number, order: number): Promise<Videos> {
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
            };

            return await this.videosRepository.save(video);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while updating video with id: ${video_id}`,
                details: error.message,
            });
        }
    }

    async updateVideosOrder(videos: Videos[], video_id: Videos['id'], new_order: number): Promise<Videos[]> {
        try {
            // find the video to move
            const video = videos.find((video) => video.id === video_id);

            // remove the video from the array
            videos = videos.filter((video) => video.id !== video_id);

            // insert the video at the new order
            videos.splice(new_order - 1, 0, video);

            const updatedVideos = videos.map((video, index) => {
                video.order = index + 1;
                return video;
            });

            return await this.videosRepository.save(updatedVideos);
        } catch (error) {
            throw new InternalServerErrorException({
                message: `Error while updating videos order`,
                details: error.message,
            });
        }
    }
}
