import { Test, TestingModule } from '@nestjs/testing';
import { FrequencyTypesController } from '../frequency-types.controller';
import { FrequencyTypesService } from '../frequency-types.service';

describe('FrequencyTypesController', () => {
  let controller: FrequencyTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrequencyTypesController],
      providers: [FrequencyTypesService],
    }).compile();

    controller = module.get<FrequencyTypesController>(FrequencyTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
