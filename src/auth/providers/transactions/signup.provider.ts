import {
  Inject,
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
import { AccountSignupDto } from '../../dto/account.signup.dto';
// providers
import { Hashing } from '../../interfaces/Hashing';

@Injectable()
export class SignupProvider {
  private readonly logger = new Logger(SignupProvider.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject() private readonly hashing: Hashing,

  ) { }


  private async fixDate(accountSignupDto: AccountSignupDto) {
    const accountDate: CreateAccountInterface = {
      email: accountSignupDto.email,
      password: await this.hashing.hash(accountSignupDto.password),
    };

    const profileDate: CreateProfileInterface = {
      firstName: accountSignupDto.firstName,
      lastName: accountSignupDto.lastName,
      bio: accountSignupDto.bio,
      phone_number: accountSignupDto.phone_number,
    };

    return { account: accountDate, profile: profileDate };
  }

  async signup(
    accountSignupDto: AccountSignupDto,
  ) {

    const { account, profile } = await this.fixDate(accountSignupDto);
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
