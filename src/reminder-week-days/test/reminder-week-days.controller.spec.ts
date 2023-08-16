import { Test, TestingModule } from '@nestjs/testing';
import { ReminderWeekDaysController } from '../reminder-week-days.controller';
import { ReminderWeekDaysService } from '../reminder-week-days.service';

describe('ReminderWeekDaysController', () => {
  let controller: ReminderWeekDaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderWeekDaysController],
      providers: [ReminderWeekDaysService],
    }).compile();

    controller = module.get<ReminderWeekDaysController>(
      ReminderWeekDaysController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
