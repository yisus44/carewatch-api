import { Module } from '@nestjs/common';
import { SubscriptionsHistoryService } from './subscriptions_history.service';
import { SubscriptionsHistoryController } from './subscriptions_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsHistory } from './entities/subscriptions_history.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SubscriptionsHistoryController],
  providers: [SubscriptionsHistoryService, JwtService],
  imports: [TypeOrmModule.forFeature([SubscriptionsHistory])],
  exports: [TypeOrmModule],
})
export class SubscriptionsHistoryModule {}
