import { IsNotEmpty, IsPositive } from 'class-validator';

export class AddTagsToCourseDto {

    @IsNotEmpty()
    @IsPositive({
        each: true
    })
    tag_ids: number[];
}