import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StripeWebHookEvents } from './enum/stripe-webook-events.enum';
import { SubscriptionsHistoryService } from '../subscriptions_history/subscriptions_history.service';
import Stripe from 'stripe';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { generateUserCacheIsPremium } from '../database/utils/generateUserSubscriptionCacheKey';
@Injectable()
export class StripeWebhooksService {
  constructor(
    private readonly subscriptionHistoryService: SubscriptionsHistoryService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly userService: UsersService,
    private readonly stripe: Stripe,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  public async handleSubscriptionPayment(signature: string, buffer: Buffer) {
    const event = await this.constructEventFromPayload(signature, buffer);

    switch (event.type) {
      case StripeWebHookEvents.INVOICE_PAID: {
        const obj: any = event.data.object;
        const customer = obj.customer;
        const endDate = new Date(obj.lines.data[0].period.end * 1000);
        const startDate = new Date(obj.lines.data[0].period.start * 1000);
        const subscription = await this.subscriptionService.findOneBy({
          stripeUserId: customer,
        });
        if (!subscription) throw new NotFoundException();
        const user = await this.userService.listOne({ email: customer.email });
        const userCacheKey = generateUserCacheIsPremium(user);
        await this.cacheManager.del(userCacheKey);
        await this.subscriptionHistoryService.create({
          endDate,
          startDate,
          stripePaymentId: event.id,
          stripePaymentObject: JSON.stringify(event),
          subscriptionId: subscription.id,
        });
        break;
      }

      case StripeWebHookEvents.PAYMENT_METHOD: {
        const obj: any = event.data.object;
        const customer = obj.customer;
        const subscription = await this.subscriptionService.findOneBy({
          stripeUserId: customer,
        });
        if (!subscription) throw new NotFoundException();
        await this.userService.updateBy(
          { id: subscription.userId },
          { hasPaymentMethod: true },
        );
        break;
      }
    }

    return event;
  }
}
