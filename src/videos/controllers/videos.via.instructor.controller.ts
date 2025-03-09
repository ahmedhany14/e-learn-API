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
import { VideosInstructorService } from '../../videos/services/instructor/videos.instructor.service';
import { FactoryKeyGeneratorProvider } from 'src/common/key.generator/providers/factory.key.generator.provider';


// Auth and Role
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';

// dto
import { AddVideoDto } from '../dtos//add.video.dto';
import { UpdateVideoDto } from '../dtos/update.video.dto';
import { ReOrderingDto } from '../..//common//dtos/re-ordering/re-ordering.dto';

// guards
import { IsYourSectionGuard } from '../../sections//guards/is.your.section.guard';
import { IsYourVideoGuard } from '../guards/is.your.video.guard';

// entities
import { Videos } from './../../videos/entity/videos.entity';

// enums
import {
    SectionEnum,
    SectionRelations,
} from 'src/sections/entity/sections.enums';
import { VideoEnum } from 'src/videos/entity/videos.enums';


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
        @Inject()
        private readonly factoryKeyGeneratorProvider: FactoryKeyGeneratorProvider<Videos>,
    ) { }

    @UseGuards(IsYourSectionGuard)
    @Post('add-video/:course_id/:section_id')
    async addVideo(
        @Param('section_id', ParseIntPipe) section_id: number,
        @Body() addVideoDto: AddVideoDto,
    ) {
        this.logger.log(
            `adding video to section with id: ${section_id}, with properties: ${JSON.stringify(addVideoDto)}`,
        );

        const select: SectionEnum[] = [];
        const relations: SectionRelations[] = [];

        const section = await this.sectionsService.findSectionById(
            select,
            relations,
            section_id,
        );

        const all_videos = await section.videos;

        const order = await this.factoryKeyGeneratorProvider.generateNewKey(
            'new_key',
            all_videos,
        );

        const video = await this.videosService.createVideo(
            addVideoDto,
            section.id,
            order,
        );

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

        const video = await this.videosService.updateVideo(
            video_id,
            updateVideoDto,
        );

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
        const section_id = request.section_id,
            course_id = request.course_id;

        const all_videos = await this.videosService.findAllVideosInSection(
            [VideoEnum.ID, VideoEnum.ORDER],
            section_id,
        );

        if (
            reOrderingDto.new_order < 1 ||
            reOrderingDto.new_order > all_videos.length
        ) {
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

            let order: string,
                target_order: number = reOrderingDto.new_order;
            const position =
                target_order === 1
                    ? 'first_key'
                    : target_order === all_videos.length
                        ? 'last_key'
                        : 'between_key';

            if (position === 'first_key') {
                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'first_key',
                    all_videos,
                    all_videos[target_order - 1].order,
                );
            } else if (position === 'last_key') {
                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'last_key',
                    all_videos,
                    all_videos[target_order - 1].order,
                );
            } else {
                let my_order = -1;

                for (let i = 0; i < all_videos.length; i++)
                    if (all_videos[i].id === video_id) my_order = i + 1;

                let prev: string, next: string;

                if (target_order > my_order) {
                    next = all_videos[target_order].order;
                    prev = all_videos[target_order - 1].order;
                } else {
                    next = all_videos[target_order - 1].order;
                    prev = all_videos[target_order - 2].order;
                }

                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'between_key',
                    all_videos,
                    prev,
                    next,
                );
            }

            await this.videosService.updateOrder(video_id, order);
        }

        return {
            response: {
                message: 'video moved successfully',
            },
        };
    }
}
