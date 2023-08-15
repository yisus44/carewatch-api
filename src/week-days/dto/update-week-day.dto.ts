import { PartialType } from '@nestjs/mapped-types';
import { CreateWeekDayDto } from './create-week-day.dto';

export class UpdateWeekDayDto extends PartialType(CreateWeekDayDto) {}
