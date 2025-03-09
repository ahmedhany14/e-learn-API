import { CreateReplyDto } from './create.reply.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateReplyDto extends PartialType(CreateReplyDto) { }