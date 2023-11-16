import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderTimeDto } from './create-reminder-time.dto';

export class UpdateReminderTimeDto extends PartialType(CreateReminderTimeDto) {}
