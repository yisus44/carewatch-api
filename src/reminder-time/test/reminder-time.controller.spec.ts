import { Test, TestingModule } from '@nestjs/testing';
import { ReminderTimeController } from '../reminder-time.controller';
import { ReminderTimeService } from '../reminder-time.service';

describe('ReminderTimeController', () => {
  let controller: ReminderTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderTimeController],
      providers: [ReminderTimeService],
    }).compile();

    controller = module.get<ReminderTimeController>(ReminderTimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
