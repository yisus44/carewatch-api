import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateReminderActivationTimeDto {
  @IsNotEmpty()
  @IsPositive()
  reminderId: number;

  @IsNotEmpty()
  @IsPositive()
  reminderWeekDayId: number;

  @IsNotEmpty()
  @IsPositive()
  reminderFrequencyId: number;
}
