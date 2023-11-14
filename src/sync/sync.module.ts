import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { UsersModule } from 'src/users/users.module';
import { UserSettingsModule } from 'src/user-settings/user-settings.module';
import { FileTypeModule } from 'src/file-type/file-type.module';
import { FilesModule } from 'src/files/files.module';
import { FrequencyTypesModule } from 'src/frequency-types/frequency-types.module';
import { GroupFilesModule } from 'src/group-files/group-files.module';
import { GroupsModule } from 'src/groups/groups.module';
import { MedicineUnitsModule } from 'src/medicine-units/medicine-units.module';
import { MedicinesModule } from 'src/medicines/medicines.module';
import { ReminderActivationTimeModule } from 'src/reminder-activation-time/reminder-activation-time.module';
import { ReminderExecutionModule } from 'src/reminder-execution/reminder-execution.module';
import { ReminderFile } from 'src/reminder-files/entities/reminder-file.entity';
import { ReminderFilesModule } from 'src/reminder-files/reminder-files.module';
import { RemindersModule } from 'src/reminders/reminders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { SubscriptionsHistory } from 'src/subscriptions_history/entities/subscriptions_history.entity';
import { SubscriptionsHistoryModule } from 'src/subscriptions_history/subscriptions_history.module';
import { UserGroupModule } from 'src/user-groups/user-group.module';
import { WeekDaysModule } from 'src/week-days/week-days.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { SyncPullService } from './sync-pull.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService, SyncPullService],
  imports: [
    UsersModule,
    UserSettingsModule,
    FileTypeModule,
    FilesModule,
    FrequencyTypesModule,
    GroupFilesModule,
    GroupsModule,
    MedicineUnitsModule,
    MedicinesModule,
    ReminderActivationTimeModule,
    ReminderFilesModule,
    RemindersModule,
    SchedulesModule,
    SubscriptionsModule,
    SubscriptionsHistoryModule,
    UserGroupModule,
    WeekDaysModule,
  ],
})
export class SyncModule {}
