import { Test, TestingModule } from '@nestjs/testing';
import { FileTypeController } from '../file-type.controller';
import { FileTypeService } from '../file-type.service';

describe('FileTypeController', () => {
  let controller: FileTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileTypeController],
      providers: [FileTypeService],
    }).compile();

    controller = module.get<FileTypeController>(FileTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
