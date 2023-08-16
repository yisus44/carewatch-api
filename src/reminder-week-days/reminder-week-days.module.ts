import { Module } from '@nestjs/common';
import { ReminderWeekDaysService } from './reminder-week-days.service';
import { ReminderWeekDaysController } from './reminder-week-days.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderWeekDay } from './entities/reminder-week-day.entity';

@Module({
  controllers: [ReminderWeekDaysController],
  providers: [ReminderWeekDaysService],
  imports: [TypeOrmModule.forFeature([ReminderWeekDay])],
  exports: [ReminderWeekDaysService],
})
export class ReminderWeekDaysModule {}
