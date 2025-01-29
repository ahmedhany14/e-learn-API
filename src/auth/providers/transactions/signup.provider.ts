import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// ORM
import { Account } from '../../../account/entity/account.entity';
import { Profile } from '../../../profile/entity/profile.entity';
import { DataSource } from 'typeorm';

// interfaces and dto
import { CreateAccountInterface } from '../../../account/interfaces/create.account.interface';
import { CreateProfileInterface } from '../../../profile/interfaces/create.profile.interface';

@Injectable()
export class SignupProvider {
  private readonly logger = new Logger(SignupProvider.name);

  constructor(private readonly dataSource: DataSource) {}

  async signup(
    account: CreateAccountInterface,
    profile: CreateProfileInterface,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedAccount: Account, savedProfile: Profile;
    try {
      const newAccount = queryRunner.manager.create(Account, account);

      savedAccount = await queryRunner.manager.save(newAccount);

      const newProfile = queryRunner.manager.create(Profile, {
        ...profile,
        account: savedAccount,
      });
      savedProfile = await queryRunner.manager.save(newProfile);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error('Error creating account and profile', error);

      throw new InternalServerErrorException('An unexpected error occurred');
    } finally {
      await queryRunner.release();
    }

    return { account: savedAccount, profile: savedProfile };
  }
}
