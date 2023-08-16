import { Test, TestingModule } from '@nestjs/testing';
import { ReminderFrequenciesService } from '../reminder-frequencies.service';

describe('ReminderFrequenciesService', () => {
  let service: ReminderFrequenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderFrequenciesService],
    }).compile();

    service = module.get<ReminderFrequenciesService>(
      ReminderFrequenciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
