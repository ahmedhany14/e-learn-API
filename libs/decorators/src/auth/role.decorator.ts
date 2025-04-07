import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '@app/enums';
import { ROLE_TYPE_KEY } from 'src/common/constants/role.constants';

export const ROLE = (...roleType: RoleEnum[]) => SetMetadata(ROLE_TYPE_KEY, roleType);
