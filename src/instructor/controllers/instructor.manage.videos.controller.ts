import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

// services
import { SectionsService } from '../../courses/service/sections.service';
import { VideosService } from '../../courses/service/videos.service';
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';

// dto
import { AddVideoDto } from '../dtos/add.video.dto';
import { ObjectIdValidationPipe } from '../../blog-system/blog/validators/object.id.validation.pipe';
import { IsYourSectionGuard } from '../guards/is.your.section.guard';

@Controller('instructor-videos')
export class InstructorManageVideosController {
  constructor(
    @Inject()
    private readonly videosService: VideosService,
    @Inject()
    private readonly sectionsService: SectionsService,
  ) {}

  @UseGuards(IsYourSectionGuard)
  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post('add-video-to-section/:section_id')
  async addVideoToSection(
    @Body() addVideoToSectionDto: AddVideoDto,
    @Param('section_id', ObjectIdValidationPipe) section_id: string,
  ) {
    const section = await this.sectionsService.findSectionById(section_id);

    if (!section) {
      throw new NotFoundException({
        message: 'Section not found',
        details: `Section with id ${section_id} not found`,
      });
    }

    const videoOrder = section.videos_id.length + 1;
    const video = await this.videosService.addVideoToSection(
      addVideoToSectionDto,
      section_id,
      videoOrder,
    );

    section.videos_id.push(video._id as string);
    await section.save();

    await section.populate('videos_id');
    return {
      response: {
        message: 'Video added to section successfully',
        section,
      },
    };
  }
}
