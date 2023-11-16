import { Test, TestingModule } from '@nestjs/testing';
import { ReminderTimeService } from './reminder-time.service';

describe('ReminderTimeService', () => {
  let service: ReminderTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderTimeService],
    }).compile();

    service = module.get<ReminderTimeService>(ReminderTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
