import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { SubscriptionsHistoryService } from 'src/subscriptions_history/subscriptions_history.service';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class SubscriptionsUserService {
  constructor(
    private readonly subscriptionsHistoryService: SubscriptionsHistoryService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}
  async getUserSubscriptionStatus(user: User) {
    let subscription = await this.subscriptionsService.getUserSubscription(
      user,
    );
    if (!subscription) {
      await this.subscriptionsService.create(user);
      return false;
    }
    const subscriptionHistory =
      await this.subscriptionsHistoryService.findUserSubscriptionService(
        subscription.id,
      );
    if (subscriptionHistory.length > 0) return true;
    return false;
  }
}
