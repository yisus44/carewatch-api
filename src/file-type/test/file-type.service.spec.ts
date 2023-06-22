import { Test, TestingModule } from '@nestjs/testing';
import { FileTypeService } from './file-type.service';

describe('FileTypeService', () => {
  let service: FileTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileTypeService],
    }).compile();

    service = module.get<FileTypeService>(FileTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
