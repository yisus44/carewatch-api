import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
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
import { StripeModule } from './stripe/stripe.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionsHistoryModule } from './subscriptions_history/subscriptions_history.module';
import { StripeWebhooksModule } from './stripe-webhooks/stripe-webhooks.module';
import { SubscriptionsUserModule } from './subscriptions-user/subscriptions-user.module';
import { CoreModule } from './core/core.module';
import { GroupsModule } from './groups/groups.module';
import { UserGroupModule } from './user-groups/user-group.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { GroupInvitationsUserModule } from './group-invitations-user/group-invitations-user.module';
import { MedicineUnitsModule } from './medicine-units/medicine-units.module';
import { MedicinesModule } from './medicines/medicines.module';
import { RemindersModule } from './reminders/reminders.module';
import { GroupFilesModule } from './group-files/group-files.module';
import { ReminderFilesModule } from './reminder-files/reminder-files.module';
import { WeekDaysModule } from './week-days/week-days.module';
import { ReminderWeekDaysModule } from './reminder-week-days/reminder-week-days.module';
import { SchedulesModule } from './schedules/schedules.module';
import { FrequencyUnitsModule } from './frequency-units/frequency-units.module';
import { ReminderFrequenciesModule } from './reminder-frequencies/reminder-frequencies.module';
import { ReminderActivationTimeModule } from './reminder-activation-time/reminder-activation-time.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ReminderExecutionModule } from './reminder-execution/reminder-execution.module';

@Module({
  imports: [
    CacheModule.register(),
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
    AwsS3Module,
    StripeModule,
    SubscriptionsModule,
    SubscriptionsHistoryModule,
    StripeWebhooksModule,
    SubscriptionsUserModule,
    CoreModule,
    GroupsModule,
    UserGroupModule,
    WhatsappModule,
    GroupInvitationsUserModule,
    MedicineUnitsModule,
    MedicinesModule,
    RemindersModule,
    GroupFilesModule,
    ReminderFilesModule,
    WeekDaysModule,
    ReminderWeekDaysModule,
    SchedulesModule,
    FrequencyUnitsModule,
    ReminderFrequenciesModule,
    ReminderActivationTimeModule,
    FirebaseModule,
    ReminderExecutionModule,
  ],
  controllers: [AppController],
  providers: [AppService, AssetsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
