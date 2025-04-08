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
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// dto
import { AddVideoDto } from '../dtos/add.video.dto';
import { UpdateVideoDto } from '../dtos/update.video.dto';
import { ReOrderingDto } from '@app/dtos';

// guards
import { IsYourSectionGuard } from '../../sections/guards/is.your.section.guard';
import { IsYourVideoGuard } from '../guards/is.your.video.guard';

@ROLE(RoleEnum.INSTRUCTOR)
@AUTH(AuthEnum.BEARER)
@Controller('videos/instructor')
export class VideosViaInstructorController {
    private readonly logger = new Logger(VideosViaInstructorController.name);

    constructor(
        @Inject()
        private readonly videosService: VideosInstructorService,
        @Inject()
        private readonly sectionsService: SectionsInstructorService,
    ) {}

    @UseGuards(IsYourSectionGuard)
    @Post('add-video/:section_id')
    async addVideo(
        @Param('section_id', ParseIntPipe) section_id: number,
        @Body() addVideoDto: AddVideoDto,
    ) {
        this.logger.log(
            `adding video to section with id: ${section_id}, with properties: ${JSON.stringify(addVideoDto)}`,
        );

        const section = await this.sectionsService.findOne({
            id: section_id,
        });

        const all_videos = await this.videosService.find({
            section: { id: section.id },
        });

        console.log('all_videos', all_videos);

        const order = all_videos.length + 1;
        const video = await this.videosService.create(addVideoDto, section.id, order);

        return {
            response: {
                message: 'video added successfully',
                video,
            },
        };
    }

    @UseGuards(IsYourVideoGuard)
    @Delete('delete-video/:id')
    async deleteVideo(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`deleting video with id: ${id}`);

        await this.videosService.findOneAndDelete({ id });

        return {
            response: {
                message: 'video deleted successfully',
            },
        };
    }

    @UseGuards(IsYourVideoGuard)
    @Patch('update-video/:id')
    async updateVideo(
        @Param('video_id', ParseIntPipe) id: number,
        @Body() updateVideoDto: UpdateVideoDto,
    ) {
        this.logger.log(`updating video with id: ${id}`);

        const video = await this.videosService.findOneAndUpdate({ id }, updateVideoDto);

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

        let all_videos = await this.videosService.find({
            section: { id: section_id },
        });

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

        const all_videos = await this.videosService.find({
            section: { id: new_section_id },
        });

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
