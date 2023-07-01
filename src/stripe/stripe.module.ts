import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';

@Module({
  controllers: [StripeController],
  providers: [
    StripeService,
    {
      provide: Stripe,
      useFactory: async () =>
        new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2022-11-15',
        }),
    },
  ],
})
export class StripeModule {}
