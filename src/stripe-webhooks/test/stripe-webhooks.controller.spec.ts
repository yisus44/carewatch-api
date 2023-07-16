import { Test, TestingModule } from '@nestjs/testing';
import { StripeWebhooksController } from '../stripe-webhooks.controller';
import { StripeWebhooksService } from '../stripe-webhooks.service';

describe('StripeWebhooksController', () => {
  let controller: StripeWebhooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeWebhooksController],
      providers: [StripeWebhooksService],
    }).compile();

    controller = module.get<StripeWebhooksController>(StripeWebhooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
