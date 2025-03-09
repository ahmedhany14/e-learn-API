import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { VideosInstructorRepo } from '../../repository/instructor/videos.instructor.repo';
import { AddVideoDto } from '../../dtos/add.video.dto';
import { VideoEnum, VideoRelations } from '../../entity/videos.enums';
import { UpdateVideoDto } from '../../dtos/update.video.dto';

@Injectable()
export class VideosInstructorService {
    constructor(
        @Inject()
        private readonly videosRepo: VideosInstructorRepo,
    ) {}

    async findOneById(
        select: VideoEnum[] = [],
        relations: VideoRelations[] = [],
        video_id: number,
    ) {
        return await this.videosRepo.findOneById(select, relations, video_id);
    }

    async createVideo(addVideoToSectionDto: AddVideoDto, section_id: number, order: string) {
        return await this.videosRepo.createVideo(addVideoToSectionDto, section_id, order);
    }

    async deleteVideo(video_id: number) {
        return await this.videosRepo.deleteVideo(video_id);
    }

    async updateVideo(video_id: number, updateVideoDto: UpdateVideoDto) {
        return await this.videosRepo.updateVideo(video_id, updateVideoDto);
    }

    async findAllVideosInSection(select: VideoEnum[] = [], section_id: number) {
        return await this.videosRepo.findAllVideosInSection(select, section_id);
    }

    async updateOrder(video_id: number, new_order: string) {
        return await this.videosRepo.updateOrder(video_id, new_order);
    }

    async moveToNewSection(video_id: number, new_section_id: number, new_order: string) {
        return await this.videosRepo.moveToNewSection(video_id, new_section_id, new_order);
    }
}
