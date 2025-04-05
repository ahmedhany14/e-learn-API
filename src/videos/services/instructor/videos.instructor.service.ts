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
    ) {}

    async createVideo(addVideoToSectionDto: AddVideoDto, section_id: Section['id'], order: number) {
        return await this.videosRepo.create(
            await this.videosRepo.newVideo(addVideoToSectionDto, section_id, order),
        );
    }

    async findOneById(id: Videos['id']) {
        return await this.videosRepo.findOne({ id });
    }

    async deleteVideo(id: Videos['id']) {
        return await this.videosRepo.findOneAndDelete({ id: id });
    }

    async updateVideo(id: Videos['id'], updateVideoDto: UpdateVideoDto) {
        await this.videosRepo.findOneAndUpdate({ id }, updateVideoDto);
    }

    async findAllVideosInSection(section_id: Section['id']) {
        return await this.videosRepo.find(
            { section: { id: section_id } },
        )
    }

    async updateVideosOrder(videos: Videos[], video_id: Videos['id'], new_order: number) {
        return await this.videosRepo.updateVideosOrder(videos, video_id, new_order);
    }

    async moveVideosFromSectionToSection(
        video_id: number,
        new_section_id: number,
        new_order: number,
    ) {
        return await this.moveTransaction.moveVideosFromSectionToSection(
            video_id,
            new_section_id,
            new_order,
        );
    }
}
