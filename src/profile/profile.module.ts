import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './services/profile.service';

// entity and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entity/profile.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    TypeOrmModule.forFeature([Profile]),
  ],
})
export class ProfileModule {}
