import { Test, TestingModule } from '@nestjs/testing';
import { AbstractMongoService } from './abstract.mongo.service';

describe('AbstractMongoService', () => {
  let service: AbstractMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbstractMongoService],
    }).compile();

    service = module.get<AbstractMongoService>(AbstractMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
