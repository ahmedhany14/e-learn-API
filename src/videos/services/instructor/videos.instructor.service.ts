import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { VideosInstructorRepo } from '../../repository/instructor/videos.instructor.repo';
import { MoveVideosFromSectionToSectionTransaction } from '../../repository/transactions/move.videos.from.section.to.section.transaction';

// dto
import { AddVideoDto } from '../../dtos/add.video.dto';
import { VideoEnum, VideoRelations } from '../../entity/videos.enums';
import { UpdateVideoDto } from '../../dtos/update.video.dto';

// entities
import { Videos } from 'src/videos/entity/videos.entity';
import { Section } from 'src/sections/entity/sections.entity';

@Injectable()
export class VideosInstructorService {
    constructor(
        @Inject()
        private readonly videosRepo: VideosInstructorRepo,

        @Inject()
        private readonly moveTransaction: MoveVideosFromSectionToSectionTransaction,
    ) { }

    async findOneById(
        select: VideoEnum[] = [],
        relations: VideoRelations[] = [],
        video_id: Videos['id'],
    ) {
        return await this.videosRepo.findOneById(select, relations, video_id);
    }

    async createVideo(addVideoToSectionDto: AddVideoDto, section_id: Section['id'], order: number) {
        return await this.videosRepo.createVideo(addVideoToSectionDto, section_id, order);
    }

    async deleteVideo(video_id: Videos['id']) {
        return await this.videosRepo.deleteVideo(video_id);
    }

    async updateVideo(video_id: Videos['id'], updateVideoDto: UpdateVideoDto) {
        return await this.videosRepo.updateVideo(video_id, updateVideoDto);
    }

    async findAllVideosInSection(select: VideoEnum[] = [], section_id: Section['id']) {
        return await this.videosRepo.findAllVideosInSection(select, section_id);
    }

    /*
    async updateOrder(video_id: number, new_order: number) {
        return await this.videosRepo.updateOrder(video_id, new_order);
    }
*/
    async moveToNewSection(video_id: number, new_section_id: number, new_order: string) {
        await this.moveToNewSection(video_id, new_section_id, new_order);
    }

    async updateVideosOrder(videos: Videos[], video_id: Videos['id'], new_order: number) {
        return await this.videosRepo.updateVideosOrder(videos, video_id, new_order);
    }

    async moveVideosFromSectionToSection(video_id: number, new_section_id: number, new_order: number) {
        return await this.moveTransaction.moveVideosFromSectionToSection(video_id, new_section_id, new_order);
    }
}
