import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { VideosInstructorRepo } from '../../repository/instructor/videos.instructor.repo';
import { MoveVideosFromSectionToSectionTransaction } from '../../repository/transactions/move.videos.from.section.to.section.transaction';

// dto
import { AddVideoDto } from '../../dtos/add.video.dto';
import { UpdateVideoDto } from '../../dtos/update.video.dto';

// entities
import { Videos } from 'src/videos/entity/videos.entity';
import { Section } from 'src/sections/entity/sections.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class VideosInstructorService {
    constructor(
        @Inject()
        private readonly videosRepo: VideosInstructorRepo,
        @Inject()
        private readonly moveTransaction: MoveVideosFromSectionToSectionTransaction,
    ) {}

    async create(addVideoToSectionDto: AddVideoDto, section_id: Section['id'], order: number) {
        return await this.videosRepo.create(
            await this.videosRepo.newVideo(addVideoToSectionDto, section_id, order),
        );
    }

    async find(filter: FindOptionsWhere<Videos>) {
        return await this.videosRepo.find(filter);
    }

    async findOne(filter: FindOptionsWhere<Videos>) {
        return await this.videosRepo.findOne(filter);
    }

    async findOneAndDelete(filter: FindOptionsWhere<Videos>) {
        await this.videosRepo.findOneAndDelete(filter);
    }

    async findOneAndUpdate(filter: FindOptionsWhere<Videos>, updateVideoDto: UpdateVideoDto) {
        await this.videosRepo.findOneAndUpdate(filter, updateVideoDto);
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
