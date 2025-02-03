import { Profile } from '../entity/profile.entity';
import { PickType } from '@nestjs/mapped-types';

export class SafeGetProfile extends PickType(Profile, [
  'first_name',
  'last_name',
  'bio',
  'phone_number',
]) {
  constructor(profile: Profile) {
    super();
    this.first_name = profile.first_name;
    this.last_name = profile.last_name;
    this.bio = profile.bio;
    this.phone_number = profile.phone_number;
  }

  first_name: string;
  last_name: string;
  bio: string;
  phone_number: string;
}