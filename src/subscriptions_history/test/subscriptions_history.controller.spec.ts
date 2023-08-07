import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsHistoryController } from '../subscriptions_history.controller';
import { SubscriptionsHistoryService } from '../subscriptions_history.service';

describe('SubscriptionsHistoryController', () => {
  let controller: SubscriptionsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsHistoryController],
      providers: [SubscriptionsHistoryService],
    }).compile();

    controller = module.get<SubscriptionsHistoryController>(
      SubscriptionsHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
