import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserSubscriber } from './subscribers/user.subscriber';
import { SubscriptionsUserService } from 'src/subscriptions-user/subscriptions-user.service';
import { SubscriptionsUserModule } from 'src/subscriptions-user/subscriptions-user.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  providers: [UserSubscriber],
  imports: [
    SubscriptionsUserModule,
    StripeModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        synchronize: true,
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        // entities: [__dirname + '/../**/*.entity.ts'],
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DatabaseModule {}
