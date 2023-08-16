import { IsNotEmpty, IsPositive, Matches } from 'class-validator';

export class CreateReminderWeekDayDto {
  @IsNotEmpty()
  @IsPositive()
  weekDayId: number;

  @IsNotEmpty()
  @Matches(/^(1[0-2]|0?[1-9]):([0-5]?[0-9]):([0-5]?[0-9])$/)
  time: string;
}
