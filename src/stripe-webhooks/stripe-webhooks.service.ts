import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StripeWebHookEvents } from './enum/stripe-webook-events.enum';
import { SubscriptionsHistoryService } from '../subscriptions_history/subscriptions_history.service';
import Stripe from 'stripe';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateUserCache } from '../auth/utils/generateUserCachKey';
import { UsersService } from '../users/users.service';
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

    if (event.type == StripeWebHookEvents.INVOICE_PAID) {
      const obj: any = event.data.object;
      const customer = obj.customer;
      const endDate = new Date(obj.lines.period.end * 1000);
      const startDate = new Date(obj.lines.period.start * 1000);
      const subscription = await this.subscriptionService.findOneBy({
        stripeUserId: customer.id,
      });
      if (!subscription) throw new NotFoundException();
      const user = await this.userService.listOne({ email: customer.email });
      const userCacheKey = generateUserCache(user);
      await this.cacheManager.del(userCacheKey);
      return await this.subscriptionHistoryService.create({
        endDate,
        startDate,
        stripePaymentId: event.id,
        stripePaymentObject: JSON.stringify(event),
        subscriptionId: subscription.id,
      });
    }
    return event;
  }
}
