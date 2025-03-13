import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';

import { Videos } from 'src/videos/entity/videos.entity';
import { Section } from 'src/sections/entity/sections.entity';

@Injectable()
export class MoveVideosFromSectionToSectionTransaction {
    constructor(
        private readonly dataSource: DataSource,
    ) { }

    async moveVideosFromSectionToSection(
        video_id: number,
        new_section_id: number,
        new_order: number,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // get video and assign it to the new section

            const new_video = await queryRunner.manager.findOne(Videos, {
                where: { id: video_id },
                relations: ['section'],
            });

            // save the video to the new section
            new_video.section.id = new_section_id;
            await queryRunner.manager.save(new_video);

            // get all videos in the section and increment their order by 1

            const new_section_videos = await queryRunner.manager.find(Videos, {
                where: { section: { id: new_section_id } },
                order: { order: 'ASC' },
            });

            const target_video = new_section_videos.find((video) => video.id === video_id);

            // remove the target video from the list
            new_section_videos.splice(new_section_videos.indexOf(target_video), 1);

            // add the target video to the list in the new order

            new_section_videos.splice(new_order - 1, 0, target_video);

            // update the order of the videos in the new section

            const updated_videos = new_section_videos.map((video, index) => {
                video.order = index + 1;
                return video;
            });

            // save the updated videos in the old section
            await queryRunner.manager.save(Videos, updated_videos);

            // commit transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            // rollback transaction
            await queryRunner.rollbackTransaction();

            // throw error
            throw new InternalServerErrorException({
                message: `Error while moving video with id: ${video_id} to new section with id: ${new_section_id}`,
                details: error.message,
            });
        } finally {
            // release query runner
            await queryRunner.release();
        }
    }

}
