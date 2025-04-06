import { Module } from '@nestjs/common';
import { AbstractMongoService } from './abstract.mongo.service';

@Module({
  providers: [AbstractMongoService],
  exports: [AbstractMongoService],
})
export class AbstractMongoModule {}
