import { Test, TestingModule } from '@nestjs/testing';
import { WeekDaysService } from '../week-days.service';

describe('WeekDaysService', () => {
  let service: WeekDaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeekDaysService],
    }).compile();

    service = module.get<WeekDaysService>(WeekDaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
