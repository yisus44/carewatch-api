import { Test, TestingModule } from '@nestjs/testing';
import { FrequencyTypesService } from '../frequency-types.service';

describe('FrequencyTypesService', () => {
  let service: FrequencyTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrequencyTypesService],
    }).compile();

    service = module.get<FrequencyTypesService>(FrequencyTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
