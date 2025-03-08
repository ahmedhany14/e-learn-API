import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { VideosRepo } from '../repository/videos.repo';
import { AddVideoDto } from '../../instructor/dtos/add.video.dto';

@Injectable()
export class VideosService {
    constructor(
        @Inject()
        private readonly videosRepo: VideosRepo,
    ) { }

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
}
