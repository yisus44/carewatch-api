import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { FileTypeModule } from './file-type/file-type.module';
import { SeedModule } from './seed/seed.module';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { MailModule } from './mail/mail.module';
import { AwsModule } from './aws/aws.module';
import { AssetsService } from './assets/assets.service';
import { AssetsModule } from './assets/assets.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AwsSesModule } from './aws-ses/aws-ses.module';
import { StripeModule } from './stripe/stripe.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionsHistoryModule } from './subscriptions_history/subscriptions_history.module';
import { StripeWebhooksModule } from './stripe-webhooks/stripe-webhooks.module';
import { SubscriptionsUserModule } from './subscriptions-user/subscriptions-user.module';
import { CoreModule } from './core/core.module';
import { GroupsModule } from './groups/groups.module';
import { GroupInvitationsModule } from './group-invitations/group-invitations.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { GroupInvitationsUserModule } from './group-invitations-user/group-invitations-user.module';
import { MedicineUnitsModule } from './medicine-units/medicine-units.module';
import { MedicinesModule } from './medicines/medicines.module';
import { RemindersModule } from './reminders/reminders.module';
import { GroupFilesModule } from './group-files/group-files.module';
import { ReminderFilesModule } from './reminder-files/reminder-files.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    CommonModule,
    FileTypeModule,
    FilesModule,
    SeedModule,
    UserSettingsModule,
    MailModule,
    AwsModule,
    AssetsModule,
    CacheModule.register(),
    AwsS3Module,
    AwsSesModule,
    StripeModule,
    SubscriptionsModule,
    SubscriptionsHistoryModule,
    StripeWebhooksModule,
    SubscriptionsUserModule,
    CoreModule,
    GroupsModule,
    GroupInvitationsModule,
    WhatsappModule,
    GroupInvitationsUserModule,
    MedicineUnitsModule,
    MedicinesModule,
    RemindersModule,
    GroupFilesModule,
    ReminderFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AssetsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
