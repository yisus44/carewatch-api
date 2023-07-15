import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';
import StripeWebhookController from './stripe-webhook.controller';

@Module({
  controllers: [StripeController, StripeWebhookController],
  providers: [
    StripeService,
    {
      provide: Stripe,
      durable: true,
      useFactory: async () =>
        new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2022-11-15',
        }),
    },
  ],
  exports: [StripeService],
})
export class StripeModule {}
