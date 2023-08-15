import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderFileDto } from './create-reminder-file.dto';

export class UpdateReminderFileDto extends PartialType(CreateReminderFileDto) {}
