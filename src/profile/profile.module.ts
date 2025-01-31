import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';

// services and repository
import { ProfileService } from './services/profile.service';
import { ProfileRepository } from './repository/profile.repo';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entity/profile.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  imports: [
    TypeOrmModule.forFeature([Profile]),
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
