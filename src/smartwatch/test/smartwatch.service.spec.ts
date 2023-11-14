import { Test, TestingModule } from '@nestjs/testing';
import { SmartwatchService } from '../smartwatch.service';

describe('SmartwatchService', () => {
  let service: SmartwatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartwatchService],
    }).compile();

    service = module.get<SmartwatchService>(SmartwatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
