import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { transformUserType } from '../types/account.type.hash';
import { AccountTypeDto } from '../dtos/account.type.dto';

@Injectable()
export class TransformUserTypePipe implements PipeTransform {
    transform(value: AccountTypeDto, metadata: ArgumentMetadata) {
        return value ? transformUserType(value.type) : {};
    }
}
