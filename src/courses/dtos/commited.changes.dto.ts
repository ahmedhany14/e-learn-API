import { PartialType } from "@nestjs/mapped-types";
import { UpdateCourseDto } from "./update.course.dto";

export class CommitedChangesDto extends PartialType(UpdateCourseDto) { }