import {
    Body,
    Controller,
    Delete,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
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

}
