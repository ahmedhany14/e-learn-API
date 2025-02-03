import { Account } from '../entity/account.entity';

export type SafeGetAccount = Pick<Account, 'id' | 'email' | 'role' | 'is_active'>;
export type SafeDeactivateAccount = Pick<Account, 'id' | 'is_active'>
export type SafeDeleteAccount = Pick<Account, 'id' | 'email' | 'role' | 'is_active'>;
export type SafeUpgradeToInstructor = Pick<Account, 'id' | 'email'>;
export type SafeResetAccountPassword = Pick<Account, 'id' | 'is_active' | 'password'>;
