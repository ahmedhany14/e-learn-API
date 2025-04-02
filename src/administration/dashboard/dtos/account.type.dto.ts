import {
    IsEnum,
    IsOptional,
} from 'class-validator';

enum AccountType {
    ACTIVE = 'active',
    DEACTIVATED = 'de-activated',
    BANNED = 'banned',
}

export class AccountTypeDto {
    @IsEnum(AccountType, { message: 'Invalid account type' })
    @IsOptional()
    type: string;
}
