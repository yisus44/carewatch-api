import { Test, TestingModule } from '@nestjs/testing';
import { SmartwatchController } from '../smartwatch.controller';
import { SmartwatchService } from '../smartwatch.service';

describe('SmartwatchController', () => {
  let controller: SmartwatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartwatchController],
      providers: [SmartwatchService],
    }).compile();

    controller = module.get<SmartwatchController>(SmartwatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
