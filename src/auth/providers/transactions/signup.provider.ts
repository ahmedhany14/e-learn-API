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
import { GooglePayload } from 'src/auth/interfaces/google.payload.interface';

@Injectable()
export class SignupProvider {
  private readonly logger = new Logger(SignupProvider.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject() private readonly hashing: Hashing,
  ) {}

  private async fixDate(accountSignupDto: AccountSignupDto) {
    const accountDate: CreateAccountInterface = {
      email: accountSignupDto.email,
      password: await this.hashing.hash(accountSignupDto.password),
    };

    return { account: accountDate };
  }

  async signup(accountSignupDto: AccountSignupDto) {
    const { account } = await this.fixDate(accountSignupDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedAccount: Account, savedProfile: Profile;
    try {
      const newAccount = queryRunner.manager.create(Account, account);
      savedAccount = await queryRunner.manager.save(newAccount);

      const newProfile = queryRunner.manager.create(Profile, {
        account: { id: savedAccount.id },
      });
      savedProfile = await queryRunner.manager.save(newProfile);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    } finally {
      await queryRunner.release();
    }

    return { account: savedAccount, profile: savedProfile };
  }

  async googleSignup(account: GooglePayload) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedAccount: Account, savedProfile: Profile;

    try {
      // 1. create new account
      const newAccount = queryRunner.manager.create(Account, {
        email: account.email,
      });

      savedAccount = await queryRunner.manager.save(Account, newAccount);

      // 2. create new profile related to the account
      const newProfile = queryRunner.manager.create(Profile, {
        account: { id: savedAccount.id },
        first_name: account.first_name,
        last_name: account.last_name,
        profile_image: account.img_url,
      });

      savedProfile = await queryRunner.manager.save(Profile, newProfile);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    } finally {
      await queryRunner.release();
      return { account: savedAccount, profile: savedProfile };
    }
  }
}
