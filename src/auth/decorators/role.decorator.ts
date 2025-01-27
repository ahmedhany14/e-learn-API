import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';
import { ROLE_TYPE_KEY } from '../../common/constants/role.constants';

export const ROLE = (...roleType: RoleEnum[]) =>
  SetMetadata(ROLE_TYPE_KEY, roleType);
