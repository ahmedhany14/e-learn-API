import {
    Body,
    Controller,
    Delete,
    Inject,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';

// decorators and types from auth
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// service
import { CourseTagService } from '../services/course.tag.service';

// guards
import { IsYourCourseGuard } from 'src/courses/guards/is.your.course.guard';
import { TagsService } from '../services/tags.service';

// types and dto
import { AddTagsToCourseDto } from '../dtos/add.tags.to.course.dto';
import { RemoveTagsFromCourseDto } from '../dtos/remove.tags.from.course.dto';

@ROLE(RoleEnum.INSTRUCTOR)
@AUTH(AuthEnum.BEARER)
@Controller('tags/instructor')
export class TagsViaInstructorController {
    constructor(
        @Inject()
        private readonly CourseTagService: CourseTagService,
        @Inject()
        private readonly TagsService: TagsService,
    ) {}

    @UseGuards(IsYourCourseGuard)
    @Post('add-tags-to-course/:course_id')
    async addTagToCourse(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() tags: AddTagsToCourseDto,
    ) {
        const is_tags_exist = await this.is_tags_exist(tags);
        if (!is_tags_exist.ret) {
            return new NotFoundException({
                message: "You are trying to add a tag that doesn't exist",
                details: `Tag with id: ${is_tags_exist.tag_id} not found`,
            });
        }
        await this.CourseTagService.addTagsToCourse(course_id, tags);

        return {
            response: {
                message: 'Tag added to course',
            },
        };
    }

    @UseGuards(IsYourCourseGuard)
    @Delete('remove-tag-from-course/:course_id')
    async removeTagFromCourse(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() tags: RemoveTagsFromCourseDto,
    ) {
        const is_tags_exist = await this.is_tags_exist(tags);
        if (!is_tags_exist.ret) {
            return new NotFoundException({
                message: "You are trying to remove a tag that doesn't exist",
                details: `Tag with id: ${is_tags_exist.tag_id} not found`,
            });
        }
        await this.CourseTagService.removeTagsFromCourse(course_id, tags);

        return {
            response: {
                message: 'Tags removed from course',
            },
        };
    }

    private async is_tags_exist(tags: AddTagsToCourseDto) {
        for (let i = 0; i < tags.tag_ids.length; i++) {
            const tag = await this.TagsService.findOne({ id: tags.tag_ids[i] });
            if (!tag) {
                return { ret: false, tag_id: tags.tag_ids[i] };
            }
        }
        return { ret: true };
    }
}
