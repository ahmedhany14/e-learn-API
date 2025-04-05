import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { AddVideoDto } from '../../dtos/add.video.dto';

// orm and entities
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Videos } from '../../entity/videos.entity';
import { AbstractRepoService } from 'y/abstract.db';

@Injectable()
export class VideosInstructorRepo extends AbstractRepoService<Videos> {
    protected readonly logger = new Logger(VideosInstructorRepo.name);

    constructor(
        @InjectRepository(Videos)
        private readonly videosRepository: Repository<Videos>,
        entityManager: EntityManager,
    ) {
        super(videosRepository, entityManager);
    }

    async newVideo(video: AddVideoDto, section_id: number, order: number) : Promise<Videos> {
        try {
            return this.videosRepository.create({
                ...video,
                section: { id: section_id },
                order,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while adding video to section',
                details: error.message,
            });
        }
    }

    async updateVideosOrder(
        videos: Videos[],
        video_id: Videos['id'],
        new_order: number,
    ): Promise<Videos[]> {
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
