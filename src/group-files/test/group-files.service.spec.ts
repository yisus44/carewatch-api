import { Test, TestingModule } from '@nestjs/testing';
import { GroupFilesService } from '../group-files.service';

describe('GroupFilesService', () => {
  let service: GroupFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupFilesService],
    }).compile();

    service = module.get<GroupFilesService>(GroupFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
