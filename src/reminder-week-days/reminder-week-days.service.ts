import { Injectable } from '@nestjs/common';
import { CreateReminderWeekDayDto } from './dto/create-reminder-week-day.dto';
import { UpdateReminderWeekDayDto } from './dto/update-reminder-week-day.dto';
import { Repository } from 'typeorm';
import { ReminderWeekDay } from './entities/reminder-week-day.entity';
import { CoreService } from '../core/core.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReminderWeekDaysService extends CoreService<ReminderWeekDay> {
  constructor(
    @InjectRepository(ReminderWeekDay)
    private readonly reminderWeekDayRepository: Repository<ReminderWeekDay>,
  ) {
    super(reminderWeekDayRepository);
  }
}
