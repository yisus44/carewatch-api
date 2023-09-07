import { Inject, Injectable } from '@nestjs/common';
import { StripeService } from '../../stripe/stripe.service';
import { SubscriptionsUserService } from '../../subscriptions-user/subscriptions-user.service';
import { User } from '../../users/entities/user.entity';
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

  async fetchInfo(user: User): Promise<User> {
    user.isPremium = true;
    user.hasPaymentMethod = true;
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
    console.log({
      user: user.id,
      premium: user.isPremium,
      pay: user.hasPaymentMethod,
    });
    return user;
  }

  async afterLoad(user: User): Promise<void> {
    let attempts = 0;
    while (attempts < 5) {
      attempts++;
      try {
        await this.fetchInfo(user);
        continue;
      } catch (ex) {
        if (ex.statusCode != 429) continue;
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      }
      console.log('it didnt work');
    }
    try {
    } catch (ex) {
      this.fetchInfo(user);
    }
  }
}
