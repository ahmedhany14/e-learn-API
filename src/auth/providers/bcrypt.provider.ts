import { Injectable } from '@nestjs/common';

// interfaces
import { Hashing } from '../interfaces/Hashing';

// bcrypt
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements Hashing {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
