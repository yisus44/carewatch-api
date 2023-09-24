import { Test, TestingModule } from '@nestjs/testing';
import { ReminderActivationTimeService } from '../reminder-activation-time.service';

describe('ReminderActivationTimeService', () => {
  let service: ReminderActivationTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderActivationTimeService],
    }).compile();

    service = module.get<ReminderActivationTimeService>(
      ReminderActivationTimeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
