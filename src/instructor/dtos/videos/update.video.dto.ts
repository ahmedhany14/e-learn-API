import { AddVideoDto } from "./add.video.dto";

import { PartialType } from "@nestjs/mapped-types";

export class UpdateVideoDto extends PartialType(AddVideoDto) { }