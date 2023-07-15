import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, JwtService],
  imports: [TypeOrmModule.forFeature([Subscription]), StripeModule],
  exports: [TypeOrmModule, SubscriptionsService],
})
export class SubscriptionsModule {}
