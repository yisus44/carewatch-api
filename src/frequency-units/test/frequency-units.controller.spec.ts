import { Test, TestingModule } from '@nestjs/testing';
import { FrequencyUnitsController } from '../frequency-units.controller';
import { FrequencyUnitsService } from '../frequency-units.service';

describe('FrequencyUnitsController', () => {
  let controller: FrequencyUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrequencyUnitsController],
      providers: [FrequencyUnitsService],
    }).compile();

    controller = module.get<FrequencyUnitsController>(FrequencyUnitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
