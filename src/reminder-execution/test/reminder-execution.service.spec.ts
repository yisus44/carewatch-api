import { Test, TestingModule } from '@nestjs/testing';
import { ReminderExecutionService } from '../reminder-execution.service';

describe('ReminderExecutionService', () => {
  let service: ReminderExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderExecutionService],
    }).compile();

    service = module.get<ReminderExecutionService>(ReminderExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
