import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsHistoryService } from '../subscriptions_history.service';

describe('SubscriptionsHistoryService', () => {
  let service: SubscriptionsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsHistoryService],
    }).compile();

    service = module.get<SubscriptionsHistoryService>(
      SubscriptionsHistoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
