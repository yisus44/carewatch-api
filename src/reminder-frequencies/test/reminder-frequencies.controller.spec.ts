import { Test, TestingModule } from '@nestjs/testing';
import { ReminderFrequenciesController } from '../reminder-frequencies.controller';
import { ReminderFrequenciesService } from '../reminder-frequencies.service';

describe('ReminderFrequenciesController', () => {
  let controller: ReminderFrequenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderFrequenciesController],
      providers: [ReminderFrequenciesService],
    }).compile();

    controller = module.get<ReminderFrequenciesController>(
      ReminderFrequenciesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
