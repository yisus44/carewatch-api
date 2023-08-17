import { Module } from '@nestjs/common';
import { ReminderActivationTimeService } from './reminder-activation-time.service';
import { ReminderActivationTimeController } from './reminder-activation-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';

@Module({
  controllers: [ReminderActivationTimeController],
  providers: [ReminderActivationTimeService],
  exports: [ReminderActivationTimeService],
  imports: [TypeOrmModule.forFeature([ReminderActivationTime])],
})
export class ReminderActivationTimeModule {}
