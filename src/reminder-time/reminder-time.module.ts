import { Module } from '@nestjs/common';
import { ReminderTimeService } from './reminder-time.service';
import { ReminderTimeController } from './reminder-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderTime } from './entities/reminder-time.entity';

@Module({
  controllers: [ReminderTimeController],
  providers: [ReminderTimeService],
  imports: [TypeOrmModule.forFeature([ReminderTime])],
  exports: [ReminderTimeService],
})
export class ReminderTimeModule {}
