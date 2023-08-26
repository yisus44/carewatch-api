import { IsNotEmpty, IsPositive, Matches, Validate } from 'class-validator';
import { IsValidTimeConstraint } from '../../common/decorators/validators/is-valid-time';

export class CreateReminderWeekDayDto {
  @IsNotEmpty()
  @IsPositive()
  weekDayId: number;

  @IsNotEmpty()
  @Validate(IsValidTimeConstraint)
  time: string;
}
