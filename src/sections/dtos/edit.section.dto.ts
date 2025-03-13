import { AddCourseSectionsDto } from './add.course.sections.dto';
import { PartialType } from '@nestjs/mapped-types';

export class EditSectionDto extends PartialType(AddCourseSectionsDto) { }
