import { Module } from '@nestjs/common';
import { ReminderActivationTimeService } from './reminder-activation-time.service';
import { ReminderActivationTimeController } from './reminder-activation-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';
import { FrequencyTypesModule } from 'src/frequency-types/frequency-types.module';
import { ReminderExecutionModule } from 'src/reminder-execution/reminder-execution.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { MailModule } from 'src/mail/mail.module';
import { RemindersModule } from 'src/reminders/reminders.module';
import { MedicinesModule } from 'src/medicines/medicines.module';
import { GroupsModule } from 'src/groups/groups.module';
import { ReminderActivationTimeHelperExecution } from './reminder-activation-time-execution.helper';
import { CacheModule } from '@nestjs/cache-manager';
import { UserGroupModule } from 'src/user-groups/user-group.module';

@Module({
  controllers: [ReminderActivationTimeController],
  providers: [
    ReminderActivationTimeHelperExecution,
    ReminderActivationTimeService,
  ],
  imports: [
    TypeOrmModule.forFeature([ReminderActivationTime]),
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
  exports: [ReminderActivationTimeService],
})
export class ReminderActivationTimeModule {}
