import { Test, TestingModule } from '@nestjs/testing';
import { ReminderFilesController } from '../reminder-files.controller';
import { ReminderFilesService } from '../reminder-files.service';

describe('ReminderFilesController', () => {
  let controller: ReminderFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderFilesController],
      providers: [ReminderFilesService],
    }).compile();

    controller = module.get<ReminderFilesController>(ReminderFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
