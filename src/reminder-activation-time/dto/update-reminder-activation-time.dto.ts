import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderActivationTimeDto } from './create-reminder-activation-time.dto';

export class UpdateReminderActivationTimeDto extends PartialType(CreateReminderActivationTimeDto) {}
