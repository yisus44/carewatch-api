import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeWebHookEvents } from './enum/stripe-webook-events.enum';
import { SubscriptionsHistoryService } from 'src/subscriptions_history/subscriptions_history.service';
import Stripe from 'stripe';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class StripeWebhooksService {
  constructor(
    private readonly subscriptionHistoryService: SubscriptionsHistoryService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly stripe: Stripe,
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
      const endDate = obj.period_end;
      const startDate = obj.period_start;
      const subscription = await this.subscriptionService.findOneBy({
        stripeUserId: customer.id,
      });
      if (!subscription) throw new NotFoundException();
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
