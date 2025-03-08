import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { VideosRepo } from '../repository/videos.repo';
import { AddVideoDto } from '../../instructor/dtos/add.video.dto';
import { VideoEnum, VideoRelations } from '../entities/enums/videos.enums';

@Injectable()
export class VideosService {
    constructor(
        @Inject()
        private readonly videosRepo: VideosRepo,
    ) { }

    async findOneById(select: VideoEnum[] = [], relations: VideoRelations[] = [], video_id: number) {
        return await this.videosRepo.findOneById(select, relations, video_id);
    }

    async createVideo(
        addVideoToSectionDto: AddVideoDto,
        section_id: number,
        order: string,
    ) {
        return await this.videosRepo.createVideo(
            addVideoToSectionDto,
            section_id,
            order,
        );
    }

    async deleteVideo(video_id: number) {
        return await this.videosRepo.deleteVideo(video_id);
    }
}
