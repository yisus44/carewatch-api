import { Test, TestingModule } from '@nestjs/testing';
import { MedicineUnitsService } from '../medicine-units.service';

describe('MedicineUnitsService', () => {
  let service: MedicineUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineUnitsService],
    }).compile();

    service = module.get<MedicineUnitsService>(MedicineUnitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
