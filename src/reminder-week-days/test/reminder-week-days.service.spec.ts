import { Test, TestingModule } from '@nestjs/testing';
import { ReminderWeekDaysService } from '../reminder-week-days.service';

describe('ReminderWeekDaysService', () => {
  let service: ReminderWeekDaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderWeekDaysService],
    }).compile();

    service = module.get<ReminderWeekDaysService>(ReminderWeekDaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
