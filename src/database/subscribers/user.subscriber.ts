import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionsUserService } from 'src/subscriptions-user/subscriptions-user.service';
import { User } from 'src/users/entities/user.entity';
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
  ) {
    this.connection.subscribers.push(this);
  }
  listenTo() {
    return User;
  }

  async afterLoad(user: User): Promise<void> {
    user.isPremium =
      await this.subscriptionUserService.getUserSubscriptionStatus(user);
  }
}
