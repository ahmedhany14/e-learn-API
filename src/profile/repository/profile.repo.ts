import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// entity and orm
import { Profile } from '../entity/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// dto
import { UpdateProfileDto } from '../dtos/update.profile.dto';

@Injectable()
export class ProfileRepository {
  private readonly logger = new Logger(ProfileRepository.name);

  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(updateProfileDto: UpdateProfileDto, accountId: number) {
    return this.profileRepository.create({
      ...updateProfileDto,
      account: { id: accountId },
    });
  }

  async findById(id: number): Promise<Profile> {
    try {
      return await this.profileRepository.findOne({
        where: { id },
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
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Un expected error occurred while fetching profile',
        details: "Couldn't fetch profile",
      });
    }
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    try {
      return await this.profileRepository.save(profile);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Un expected error occurred while updating profile',
        details: "Couldn't update profile",
      });
    }
  }
}
