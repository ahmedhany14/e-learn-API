import {
  Injectable,
  InternalServerErrorException,
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
      const newProfile = queryRunner.manager.create(Profile, profile);
      const newAccount = queryRunner.manager.create(Account, {
        ...account,
        profile: newProfile,
      });

      savedProfile = await queryRunner.manager.save(newProfile);
      savedAccount = await queryRunner.manager.save(newAccount);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      console.log('error', error);

      throw new InternalServerErrorException('An unexpected error occurred');
    } finally {
      await queryRunner.release();
    }

    return { account: savedAccount, profile: savedProfile };
  }
}
