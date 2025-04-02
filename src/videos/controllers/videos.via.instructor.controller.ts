import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

// services
import { SectionsInstructorService } from '../../sections/services/instructor/sections.instructor.service';
import { VideosInstructorService } from '../services/instructor/videos.instructor.service';

// Auth and Role
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';

// dto
import { AddVideoDto } from '../dtos/add.video.dto';
import { UpdateVideoDto } from '../dtos/update.video.dto';
import { ReOrderingDto } from '../../common/dtos/re-ordering/re-ordering.dto';

// guards
import { IsYourSectionGuard } from '../../sections/guards/is.your.section.guard';
import { IsYourVideoGuard } from '../guards/is.your.video.guard';

// types
import { SectionEnum, SectionRelations } from 'src/sections/entity/sections.enums';
import { VideoEnum, VideoRelations } from 'src/videos/entity/videos.enums';
import * as console from 'node:console';

@ROLE(RoleEnum.INSTRUCTOR)
@AUTH(AuthEnum.BEARER)
@Controller('videos-via-instructor')
export class VideosViaInstructorController {
    private readonly logger = new Logger(VideosViaInstructorController.name);

    constructor(
        @Inject()
        private readonly videosService: VideosInstructorService,
        @Inject()
        private readonly sectionsService: SectionsInstructorService,
        //        @Inject()
        //        private readonly keyGeneratorService: KeyGeneratorService<Videos>,
    ) { }

    @UseGuards(IsYourSectionGuard)
    @Post('add-video/:section_id')
    async addVideo(
        @Param('section_id', ParseIntPipe) section_id: number,
        @Body() addVideoDto: AddVideoDto,
    ) {
        this.logger.log(
            `adding video to section with id: ${section_id}, with properties: ${JSON.stringify(addVideoDto)}`,
        );

        const select: SectionEnum[] = [];
        const relations: SectionRelations[] = [];

        const section = await this.sectionsService.findSectionById(select, relations, section_id);

        const all_videos = await this.videosService.findAllVideosInSection(
            [VideoEnum.ID, VideoEnum.ORDER],
            section_id,
        )

        console.log('all_videos', all_videos);

        //const order = await this.keyGeneratorService.generateNewKey(all_videos);

        const order = all_videos.length + 1;
        const video = await this.videosService.createVideo(addVideoDto, section.id, order);

        return {
            response: {
                message: 'video added successfully',
                video,
            },
        };
    }

    @UseGuards(IsYourVideoGuard)
    @Delete('delete-video/:video_id')
    async deleteVideo(@Param('video_id', ParseIntPipe) video_id: number) {
        this.logger.log(`deleting video with id: ${video_id}`);

        await this.videosService.deleteVideo(video_id);

        return {
            response: {
                message: 'video deleted successfully',
            },
        };
    }

    @UseGuards(IsYourVideoGuard)
    @Patch('update-video/:video_id')
    async updateVideo(
        @Param('video_id', ParseIntPipe) video_id: number,
        @Body() updateVideoDto: UpdateVideoDto,
    ) {
        this.logger.log(`updating video with id: ${video_id}`);

        const video = await this.videosService.updateVideo(video_id, updateVideoDto);

        return {
            response: {
                message: 'video updated successfully',
                video,
            },
        };
    }

    @UseGuards(IsYourVideoGuard)
    @Patch('move-video-in-section/:video_id')
    async moveVideo(
        @Param('video_id', ParseIntPipe) video_id: number,
        @Req() request,
        @Body() reOrderingDto: ReOrderingDto,
    ) {
        const section_id = request.section_id;

        let all_videos = await this.videosService.findAllVideosInSection(
            [VideoEnum.ID, VideoEnum.ORDER],
            section_id,
        );

        if (reOrderingDto.new_order > all_videos.length) {
            throw new ConflictException({
                message: 'Invalid new order',
                details: 'New order is out of range',
            });
        }

        if (
            reOrderingDto.new_order !==
            all_videos.findIndex((video) => video.id === video_id) + 1
        ) {
            this.logger.log(
                `moving video with id: ${video_id} to new order: ${reOrderingDto.new_order}`,
            );

            all_videos = await this.videosService.updateVideosOrder(
                all_videos,
                video_id,
                reOrderingDto.new_order,
            );

        }

        return {
            response: {
                message: 'video moved successfully',
            },
        };
    }

    @UseGuards(IsYourVideoGuard)
    @UseGuards(IsYourSectionGuard)
    @Patch('move-video-from-section-to-section/:video_id/:section_id')
    async moveVideoFromSectionToSection(
        @Param('video_id', ParseIntPipe) video_id: number,
        @Param('section_id', ParseIntPipe) new_section_id: number,
        @Body() reOrderingDto: ReOrderingDto,
    ) {
        this.logger.log(
            `moving video with id: ${video_id} to new section with id: ${new_section_id}`,
        );


        const all_videos = await this.videosService.findAllVideosInSection(
            [VideoEnum.ID, VideoEnum.ORDER],
            new_section_id,
        );

        if (reOrderingDto.new_order > all_videos.length + 1) {
            throw new ConflictException({
                message: 'Invalid new order',
                details: 'New order is out of range',
            });
        }

        await this.videosService.moveVideosFromSectionToSection(
            video_id,
            new_section_id,
            reOrderingDto.new_order,
        );

        return {
            response: {
                message: 'video moved successfully',
            },
        };
    }
}
