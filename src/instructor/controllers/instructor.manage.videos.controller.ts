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
import { SectionsService } from '../../courses/service/sections.service';
import { VideosService } from '../../courses/service/videos.service';
import { FactoryKeyGeneratorProvider } from 'src/courses/providers/factory.key.generator.provider';

// Auth and Role
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';

// dto
import { AddVideoDto } from '../dtos/add.video.dto';

// guards
import { IsYourSectionGuard } from '../guards/is.your.section.guard';

// entities
import { Videos } from 'src/courses/entities/videos.entity';
import {
    SectionEnum,
    SectionRelations,
} from 'src/courses/entities/enums/sections.enums';
import { IsYourVideoGuard } from '../guards/is.your.video.guard';
import { UpdateVideoDto } from '../dtos/update.video.dto';
import { ReOrderingDto } from '../dtos/re-ordering.dto';
import { VideoEnum } from 'src/courses/entities/enums/videos.enums';

@Controller('instructor-videos')
export class InstructorManageVideosController {
    private readonly logger = new Logger(InstructorManageVideosController.name);

    constructor(
        @Inject()
        private readonly videosService: VideosService,
        @Inject()
        private readonly sectionsService: SectionsService,
        @Inject()
        private readonly factoryKeyGeneratorProvider: FactoryKeyGeneratorProvider<Videos>,
    ) { }

    @UseGuards(IsYourSectionGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
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
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
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
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
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
                video
            },
        };
    }

    @UseGuards(IsYourVideoGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('move-video-in-section/:video_id')
    async moveVideo(
        @Param('video_id', ParseIntPipe) video_id: number,
        @Req() request,
        @Body() reOrderingDto: ReOrderingDto,
    ) {
        const section_id = request.section_id, course_id = request.course_id;

        const all_videos = await this.videosService.findAllVideosInSection([VideoEnum.ID, VideoEnum.ORDER], section_id);


        if (reOrderingDto.new_order < 1 || reOrderingDto.new_order > all_videos.length) {
            throw new ConflictException({
                message: 'Invalid new order',
                details: 'New order is out of range',
            });
        }

        if (reOrderingDto.new_order !== all_videos.findIndex(video => video.id === video_id) + 1) {
            this.logger.log(`moving video with id: ${video_id} to new order: ${reOrderingDto.new_order}`);

            let order: string, target_order: number = reOrderingDto.new_order;
            const position = target_order === 1 ? 'first_key' : target_order === all_videos.length ? 'last_key' : 'between_key';

            if (position === 'first_key') {
                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'first_key',
                    all_videos,
                    all_videos[target_order - 1].order
                );
            }

            else if (position === 'last_key') {
                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'last_key',
                    all_videos,
                    all_videos[target_order - 1].order
                );
            }
            else {
                let my_order = -1;

                for (let i = 0; i < all_videos.length; i++) 
                    if (all_videos[i].id === video_id) 
                        my_order = i + 1;
                

                let prev: string, next: string;

                if (target_order > my_order) {
                    next = all_videos[target_order].order;
                    prev = all_videos[target_order - 1].order;
                }
                else {
                    next = all_videos[target_order - 1].order;
                    prev = all_videos[target_order - 2].order;
                }

                order = await this.factoryKeyGeneratorProvider.generateNewKey(
                    'between_key',
                    all_videos,
                    prev,
                    next
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
