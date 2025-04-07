import { Controller } from '@nestjs/common';
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';

@AUTH(AuthEnum.BEARER)
@Controller('search')
export class SearchController {}
