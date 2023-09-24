import { Module } from '@nestjs/common';
import { ReminderActivationTimeService } from './reminder-activation-time.service';
import { ReminderActivationTimeController } from './reminder-activation-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderActivationTime } from './entities/reminder-activation-time.entity';

@Module({
  controllers: [ReminderActivationTimeController],
  providers: [ReminderActivationTimeService],
  imports: [TypeOrmModule.forFeature([ReminderActivationTime])],
  exports: [ReminderActivationTimeService],
})
export class ReminderActivationTimeModule {}
