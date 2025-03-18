import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

// entity and orm
import { Profile } from '../entity/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { ProfileRelations } from '../entity/profile.enum';

@Injectable()
export class ProfileRepository {
    private readonly logger = new Logger(ProfileRepository.name);

    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
    ) { }

    async findById(
        id: number,
        select: string[] = [],
        relation: string[] = [],
    ): Promise<Profile> {
        try {
            return await this.profileRepository.findOne({
                where: { id },
                select: select as FindOptionsSelect<Profile>,
                relations: relation,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'An unexpected error occurred',
                error: error.message,
            });
        }
    }

    async findByAccountId(
        accountId: number,
        select: string[] = [],
        relation: string[] = [],
    ): Promise<Profile> {
        try {
            return await this.profileRepository.findOne({
                where: { account: { id: accountId } },
                select: select as FindOptionsSelect<Profile>,
                relations: relation,
            });
        } catch (error) {
            console.log(error);

            throw new InternalServerErrorException({
                message: 'Un expected error occurred while fetching profile',
                details: "Couldn't fetch profile",
            });
        }
    }

    async findByPhoneNumber(
        phone_number: string,
        select: string[],
        relation: string[],
    ): Promise<Profile> {
        try {
            return await this.profileRepository.findOne({
                where: { phone_number },
                select: select as FindOptionsSelect<Profile>,
                relations: relation,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Un expected error occurred while fetching profile',
                details: "Couldn't fetch profile",
            });
        }
    }

    async updateProfile(profile: Profile): Promise<void> {
        try {
            await this.profileRepository.update(profile.id, profile);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                message: 'Un expected error occurred while updating profile',
                details: "Couldn't update profile",
            });
        }
    }
}
