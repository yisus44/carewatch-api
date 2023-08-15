import { Test, TestingModule } from '@nestjs/testing';
import { ReminderFilesService } from '../reminder-files.service';

describe('ReminderFilesService', () => {
  let service: ReminderFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderFilesService],
    }).compile();

    service = module.get<ReminderFilesService>(ReminderFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
