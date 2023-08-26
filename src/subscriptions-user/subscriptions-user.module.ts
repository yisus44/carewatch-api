import { Module } from '@nestjs/common';
import { SubscriptionsUserService } from './subscriptions-user.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { SubscriptionsHistoryModule } from '../subscriptions_history/subscriptions_history.module';

@Module({
  providers: [SubscriptionsUserService],
  imports: [SubscriptionsModule, SubscriptionsHistoryModule],
  exports: [SubscriptionsUserService],
})
export class SubscriptionsUserModule {}
