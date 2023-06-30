import { Test, TestingModule } from '@nestjs/testing';
import { AwsSesController } from '../aws-ses.controller';
import { AwsSesService } from '../aws-ses.service';

describe('AwsSesController', () => {
  let controller: AwsSesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwsSesController],
      providers: [AwsSesService],
    }).compile();

    controller = module.get<AwsSesController>(AwsSesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
