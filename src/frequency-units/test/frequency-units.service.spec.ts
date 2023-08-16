import { Test, TestingModule } from '@nestjs/testing';
import { FrequencyUnitsService } from '../frequency-units.service';

describe('FrequencyUnitsService', () => {
  let service: FrequencyUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrequencyUnitsService],
    }).compile();

    service = module.get<FrequencyUnitsService>(FrequencyUnitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
