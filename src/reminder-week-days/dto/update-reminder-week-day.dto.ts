import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderWeekDayDto } from './create-reminder-week-day.dto';

export class UpdateReminderWeekDayDto extends PartialType(CreateReminderWeekDayDto) {}
