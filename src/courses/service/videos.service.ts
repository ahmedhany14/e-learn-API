import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { VideosRepo } from '../repository/videos.repo';
import { AddVideoDto } from '../../instructor/dtos/add.video.dto';
import { VideoEnum, VideoRelations } from '../entities/enums/videos.enums';
import { UpdateVideoDto } from 'src/instructor/dtos/update.video.dto';

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

    async updateVideo(video_id: number, updateVideoDto: UpdateVideoDto) {
        return await this.videosRepo.updateVideo(video_id, updateVideoDto);
    }

    async findAllVideosInSection(
        select: VideoEnum[] = [],
        section_id: number,
    ) {
        return await this.videosRepo.findAllVideosInSection(select, section_id);
    }

    async updateOrder(video_id: number, new_order: string) {
        return await this.videosRepo.updateOrder(video_id, new_order);
    }
}
