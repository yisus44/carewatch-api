import { Inject, Injectable } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import { SubscriptionsUserService } from 'src/subscriptions-user/subscriptions-user.service';
import { User } from 'src/users/entities/user.entity';
import Stripe from 'stripe';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
  Connection,
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private readonly connection: Connection,
    private readonly subscriptionUserService: SubscriptionsUserService,
    private readonly stripeService: StripeService,
  ) {
    this.connection.subscribers.push(this);
  }
  listenTo() {
    return User;
  }

  async afterLoad(user: User): Promise<void> {
    const stripeCustomer = await this.stripeService.createOrFindCustomer({
      email: user.email,
    });
    const subPromise = [
      this.stripeService.findCustomerSubscription(stripeCustomer.id),
      this.stripeService.findPaymentMethod(stripeCustomer.id),
    ];

    const [subscription, paymentMethods] = await Promise.all(subPromise);
    const castedPaymentMethod =
      paymentMethods as any as Stripe.ApiList<Stripe.PaymentMethod>;
    user.isPremium = subscription ? true : false;
    user.hasPaymentMethod = castedPaymentMethod.data.length > 0;
  }
}
