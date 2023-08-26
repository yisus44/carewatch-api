import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { User } from '../users/entities/user.entity';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from '../core/core.service';
import { StripeSubscriptionAlreadyCancelledException } from '../common/exceptions/stripe-subscription-already-cancelled';

@Injectable()
export class SubscriptionsService extends CoreService<Subscription> {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {
    super(subscriptionsRepository);
  }

  async findOneBy(query: Partial<Subscription>) {
    return await this.subscriptionsRepository.findOneBy(query);
  }
  async create(user: User) {
    const customer = await this.stripeService.createOrFindCustomer({
      email: user.email,
    });

    const subscription = super.create({
      userId: user.id,
      stripeUserId: customer.id,
    });
    return subscription;
  }

  async getUserSubscription(user: User) {
    return await super.listOne({
      userId: user.id,
    });
  }

  async subscribe(user: User): Promise<any> {
    let subscription = await this.getUserSubscription(user);

    try {
      if (!subscription) subscription = await this.create(user);
      const { id } = await this.stripeService.createSubscription({
        stripeCustomerId: subscription.stripeUserId,
      });
      await this.subscriptionsRepository.update(subscription.id, {
        stripeSubscriptionId: id,
      });
    } catch (ex) {
      console.log(ex.message);
    } finally {
      return subscription;
    }
  }

  async unsubscribe(user: User) {
    const subscription = await this.subscriptionsRepository.findOneBy({
      userId: user.id,
    });
    if (!subscription) throw new StripeSubscriptionAlreadyCancelledException();
    //We cancel it, stripe will remove when the billing period is finished
    await this.stripeService.cancelSubscription(subscription.stripeUserId);
    await this.subscriptionsRepository.update(subscription.id, {
      stripeSubscriptionId: null,
    });
    return subscription;
  }
}
