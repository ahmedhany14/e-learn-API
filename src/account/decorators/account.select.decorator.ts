import { AccountEnum } from '../entity/account.enum';
import { SetMetadata } from '@nestjs/common';
import { SelectKey } from '../../common/constants/select.constant';

export const ACCOUNT_SELECT = (...fields: AccountEnum[]) =>
  SetMetadata(SelectKey, fields);
