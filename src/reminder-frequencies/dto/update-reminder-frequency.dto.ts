import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderFrequencyDto } from './create-reminder-frequency.dto';

export class UpdateReminderFrequencyDto extends PartialType(CreateReminderFrequencyDto) {}
