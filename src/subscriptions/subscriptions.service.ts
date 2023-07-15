import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import { User } from 'src/users/entities/user.entity';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}
  async create(user: User) {
    const customer = await this.stripeService.createCustomer({
      email: user.email,
    });

    const subscription = this.subscriptionsRepository.create({
      userId: user.id,
      stripeUserId: customer.id,
    });
    return await this.subscriptionsRepository.save(subscription);
  }

  async getUserSubscription(user: User) {
    return await this.subscriptionsRepository.findOneBy({
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
    if (!subscription) throw new NotFoundException();
    //We cancel it, stripe will remove when the billing period is finished
    await this.stripeService.cancelSubscription(subscription.stripeUserId);
    await this.subscriptionsRepository.update(subscription.id, {
      stripeSubscriptionId: null,
    });
    return subscription;
  }
}
