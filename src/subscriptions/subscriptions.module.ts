import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [TypeOrmModule.forFeature([Subscription])],
  exports: [TypeOrmModule],
})
export class SubscriptionsModule {}
