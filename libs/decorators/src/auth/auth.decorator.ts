import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from 'src/common/constants/auth.constants';
import { AuthEnum } from '@app/enums';

export const AUTH = (...authType: AuthEnum[]) => SetMetadata(AUTH_TYPE_KEY, authType);
