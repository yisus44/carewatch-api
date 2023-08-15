import { Test, TestingModule } from '@nestjs/testing';
import { GroupFilesController } from '../group-files.controller';
import { GroupFilesService } from '../group-files.service';

describe('GroupFilesController', () => {
  let controller: GroupFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupFilesController],
      providers: [GroupFilesService],
    }).compile();

    controller = module.get<GroupFilesController>(GroupFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
