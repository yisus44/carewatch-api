import { Module } from '@nestjs/common';
import { ReminderTimeService } from './reminder-time.service';
import { ReminderTimeController } from './reminder-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderTime } from './entities/reminder-time.entity';
import { ReminderExecutionModule } from 'src/reminder-execution/reminder-execution.module';
import { ReminderTimeHelper } from './reminder-time-execution.helper';
import { CacheModule } from '@nestjs/cache-manager';
import { UserGroupModule } from 'src/user-groups/user-group.module';
import { FrequencyTypesModule } from 'src/frequency-types/frequency-types.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { MailModule } from 'src/mail/mail.module';
import { RemindersModule } from 'src/reminders/reminders.module';
import { MedicinesModule } from 'src/medicines/medicines.module';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  controllers: [ReminderTimeController],
  providers: [ReminderTimeService, ReminderTimeHelper],
  imports: [
    TypeOrmModule.forFeature([ReminderTime]),
    ReminderExecutionModule,
    CacheModule.register(),
    UserGroupModule,
    FrequencyTypesModule,
    ReminderExecutionModule,
    WhatsappModule,
    MailModule,
    RemindersModule,
    MedicinesModule,
    GroupsModule,
  ],
  exports: [ReminderTimeService],
})
export class ReminderTimeModule {}
