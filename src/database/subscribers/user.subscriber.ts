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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  generateUserCacheHasPaymentMethod,
  generateUserCacheIsPremium,
} from '../utils/generateUserSubscriptionCacheKey';
@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private readonly connection: Connection,
    private readonly subscriptionUserService: SubscriptionsUserService,
    private readonly stripeService: StripeService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.connection.subscribers.push(this);
  }
  listenTo() {
    return User;
  }
  async fetchInfo(user: User): Promise<User> {
    try {
      const isPremiumCacheKey = generateUserCacheIsPremium(user);

      const isPremiumCached = await this.cacheManager.get<boolean>(
        isPremiumCacheKey,
      );

      if (isPremiumCached !== undefined) {
        user.isPremium = isPremiumCached;
      } else {
        user.isPremium =
          await this.subscriptionUserService.getUserSubscriptionStatus(user);
        await this.cacheManager.set(isPremiumCacheKey, user.isPremium, 15000);
      }
    } catch (error) {
      console.log({ errorAtUserSubscriber: error });
    }

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
          setTimeout(resolve, attempts * 1000);
        });
        console.log('Problem retriving user info', { ex });
      }
    }
  }
}
