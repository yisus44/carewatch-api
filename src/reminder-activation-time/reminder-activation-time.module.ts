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

@Module({
  controllers: [ReminderActivationTimeController],
  providers: [ReminderActivationTimeService],
  imports: [
    TypeOrmModule.forFeature([ReminderActivationTime]),
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
