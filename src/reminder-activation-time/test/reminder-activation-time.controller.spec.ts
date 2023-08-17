import { Test, TestingModule } from '@nestjs/testing';
import { ReminderActivationTimeController } from '../reminder-activation-time.controller';
import { ReminderActivationTimeService } from '../reminder-activation-time.service';

describe('ReminderActivationTimeController', () => {
  let controller: ReminderActivationTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderActivationTimeController],
      providers: [ReminderActivationTimeService],
    }).compile();

    controller = module.get<ReminderActivationTimeController>(
      ReminderActivationTimeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
