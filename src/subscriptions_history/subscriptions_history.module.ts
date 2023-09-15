import { Module } from '@nestjs/common';
import { SubscriptionsHistoryService } from './subscriptions_history.service';
import { SubscriptionsHistoryController } from './subscriptions_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsHistory } from './entities/subscriptions_history.entity';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  controllers: [SubscriptionsHistoryController],
  providers: [SubscriptionsHistoryService, JwtService],
  imports: [
    TypeOrmModule.forFeature([SubscriptionsHistory]),
    SubscriptionsModule,
  ],
  exports: [TypeOrmModule, SubscriptionsHistoryService],
})
export class SubscriptionsHistoryModule {}
