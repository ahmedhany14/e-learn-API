import {
    Body,
    Controller,
    Inject,
    Logger,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';

// services
import { SectionsService } from '../../courses/service/sections.service';
import { VideosService } from '../../courses/service/videos.service';

// Auth and Role
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';

// dto
import { AddVideoDto } from '../dtos/add.video.dto';

// guards
import { IsYourSectionGuard } from '../guards/is.your.section.guard';

@Controller('instructor-videos')
export class InstructorManageVideosController {
    private readonly logger = new Logger(InstructorManageVideosController.name);

    constructor(
        @Inject()
        private readonly videosService: VideosService,
        @Inject()
        private readonly sectionsService: SectionsService,
    ) { }

    /*@UseGuards(IsYourSectionGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Post('add-video-to-section/:section_id')
    async addVideoToSection(
        @Body() addVideoToSectionDto: AddVideoDto,
        @Param('section_id', ParseIntPipe) section_id: number,
    ) {
        const section = await this.sectionsService.findSectionById(section_id);

        let videoOrder: string;

        if()


        const video = await this.videosService.addVideoToSection(
            addVideoToSectionDto,
            section_id,
            videoOrder,
        );


        await section.populate('videos_id');
        return {
            response: {
                message: 'Video added to section successfully',
                section,
            },
        };
    }*/
}
