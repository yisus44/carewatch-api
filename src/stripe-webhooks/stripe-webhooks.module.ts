import { Module } from '@nestjs/common';
import { StripeWebhooksService } from './stripe-webhooks.service';
import { StripeWebhooksController } from './stripe-webhooks.controller';
import { SubscriptionsHistoryModule } from '../subscriptions_history/subscriptions_history.module';
import Stripe from 'stripe';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';

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
  imports: [
    UsersModule,
    SubscriptionsHistoryModule,
    SubscriptionsModule,
    CacheModule.register(),
  ],
})
export class StripeWebhooksModule {}
