import { Module } from '@nestjs/common';
import { StripeWebhooksService } from './stripe-webhooks.service';
import { StripeWebhooksController } from './stripe-webhooks.controller';
import { SubscriptionsHistoryModule } from 'src/subscriptions_history/subscriptions_history.module';
import Stripe from 'stripe';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  controllers: [StripeWebhooksController],
  providers: [
    StripeWebhooksService,
    {
      provide: Stripe,
      durable: true,
      useFactory: async () =>
        new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2022-11-15',
        }),
    },
  ],
  imports: [SubscriptionsHistoryModule, SubscriptionsModule],
})
export class StripeWebhooksModule {}
