import { RoleEnum} from '../../auth/enums/role.enum';

export interface CreateAccountInterface{
  email: string;
  password: string;
  role?: RoleEnum;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}