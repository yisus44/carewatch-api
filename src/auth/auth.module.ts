import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { SubscriptionsHistory } from 'src/subscriptions_history/entities/subscriptions_history.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SubscriptionsModule,
    SubscriptionsHistory,
    UsersModule,
    PassportModule,
    ConfigModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
})
export class AuthModule {}
