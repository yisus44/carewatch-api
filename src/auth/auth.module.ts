import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { SubscriptionsHistory } from '../subscriptions_history/entities/subscriptions_history.entity';
import * as bcrypt from 'bcrypt';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'BcryptType',
      useValue: bcrypt,
    },
  ],
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
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
