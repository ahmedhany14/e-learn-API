import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// entity and orm
import { Profile } from '../entity/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileRepository {
  private readonly logger = new Logger(ProfileRepository.name);

  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findById(id: number): Promise<Profile> {
    try {
      return await this.profileRepository.findOne({
        where: { id },
        select: [
          'id',
          'firstName',
          'lastName',
          'bio',
          'phone_number',
          'created_at',
        ],
        relations: ['account'],
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }

  async findByAccountId(accountId: number): Promise<Profile> {
    try {
      return await this.profileRepository.findOne({
        where: { account: { id: accountId } },
        select: [
          'id',
          'firstName',
          'lastName',
          'bio',
          'phone_number',
          'created_at',
        ],
        relations: ['account'],
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error,
      });
    }
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    try {
      return await this.profileRepository.save(profile);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
      });
    }
  }
}
