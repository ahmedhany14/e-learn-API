import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
    transform(blog_id: string) {
        if (!isValidObjectId(blog_id)) {
            throw new BadRequestException('Invalid blog id');
        }
        return blog_id;
    }
}
