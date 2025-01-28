import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entity/profile.entity';

@Injectable()
export class ProfileService {
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
          'created_at'
        ],
        relations: ['account'],
      });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
