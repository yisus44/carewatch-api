import { Test, TestingModule } from '@nestjs/testing';
import { MedicineUnitsController } from '../medicine-units.controller';
import { MedicineUnitsService } from '../medicine-units.service';

describe('MedicineUnitsController', () => {
  let controller: MedicineUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineUnitsController],
      providers: [MedicineUnitsService],
    }).compile();

    controller = module.get<MedicineUnitsController>(MedicineUnitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
