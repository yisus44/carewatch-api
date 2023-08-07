import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsUserService } from '../subscriptions-user.service';

describe('SubscriptionsUserService', () => {
  let service: SubscriptionsUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsUserService],
    }).compile();

    service = module.get<SubscriptionsUserService>(SubscriptionsUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
