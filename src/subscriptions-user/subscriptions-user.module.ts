import { Module } from '@nestjs/common';
import { SubscriptionsUserService } from './subscriptions-user.service';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { SubscriptionsHistoryModule } from 'src/subscriptions_history/subscriptions_history.module';

@Module({
  providers: [SubscriptionsUserService],
  imports: [SubscriptionsModule, SubscriptionsHistoryModule],
})
export class SubscriptionsUserModule {}
